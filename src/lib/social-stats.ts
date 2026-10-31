export type SocialStatStatus = "active" | "inactive";

export type TrendWindowKey = "now" | "lookback_7d" | "lookback_1m" | "lookback_3m";

export type WindowMetrics = {
  primary_value: number | null;
  secondary_label: string | null;
  secondary_value: number | null;
  avg_views: number | null;
  engagement_rate: number | null;
  as_of: string | null;
};

export type SocialStatRow = {
  id: string;
  name: string;
  handle: string;
  url: string;
  primary_label: string;
  source: string;
  last_synced_at: string | null;
  status: SocialStatStatus;
  windows: Record<TrendWindowKey, WindowMetrics | null>;
};

export type SocialStatsPayload = {
  rows: SocialStatRow[];
  totalFollowers: number | null;
  lastSyncedAt: string | null;
};

type SheetSnapshot = {
  date: string;
  platform: string;
  name: string;
  handle: string;
  url: string;
  metric_label: string;
  metric_value: number | null;
  secondary_label: string | null;
  secondary_value: number | null;
  avg_views: number | null;
  engagement_rate: number | null;
  source: string;
  synced_at: string | null;
  status: SocialStatStatus;
};

export const socialStatIdToSocialId: Record<string, string> = {
  x: "twitter",
};

export function resolveSocialId(statId: string) {
  return socialStatIdToSocialId[statId] ?? statId;
}

export const trendWindows: { key: TrendWindowKey; label: string }[] = [
  { key: "now", label: "Now" },
  { key: "lookback_7d", label: "7 days" },
  { key: "lookback_1m", label: "1 month" },
  { key: "lookback_3m", label: "3 months" },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const LOOKBACK_DAYS: Partial<Record<TrendWindowKey, number>> = {
  lookback_7d: 7,
  lookback_1m: 30,
  lookback_3m: 90,
};
const AUDIENCE_LABELS = new Set(["followers", "subscribers"]);

function parseNumber(raw: string | undefined): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function parseDate(value: string): number | null {
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function toWindowMetrics(snap: SheetSnapshot): WindowMetrics {
  return {
    primary_value: snap.metric_value,
    secondary_label: snap.secondary_label,
    secondary_value: snap.secondary_value,
    avg_views: snap.avg_views,
    engagement_rate: snap.engagement_rate,
    as_of: snap.date || snap.synced_at,
  };
}

function findLookbackSnapshot(
  snapshots: SheetSnapshot[],
  latestDateMs: number,
  days: number,
): SheetSnapshot | null {
  const target = latestDateMs - days * DAY_MS;
  let best: SheetSnapshot | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const snap of snapshots) {
    const t = parseDate(snap.date);
    if (t == null || t >= latestDateMs) continue;

    const delta = Math.abs(t - target);
    const isOnOrBefore = t <= target;
    const bestIsOnOrBefore = best != null && parseDate(best.date)! <= target;

    if (
      !best ||
      (isOnOrBefore && !bestIsOnOrBefore) ||
      (isOnOrBefore === bestIsOnOrBefore && delta < bestDelta)
    ) {
      best = snap;
      bestDelta = delta;
    }
  }

  if (!best) return null;

  const bestTime = parseDate(best.date)!;
  const ageDays = (latestDateMs - bestTime) / DAY_MS;
  if (ageDays < days * 0.5) return null;

  return best;
}

function mapSnapshotsToPayload(snapshots: SheetSnapshot[]): SocialStatsPayload {
  const byPlatform = new Map<string, SheetSnapshot[]>();

  for (const snap of snapshots) {
    const list = byPlatform.get(snap.platform) ?? [];
    list.push(snap);
    byPlatform.set(snap.platform, list);
  }

  const rows: SocialStatRow[] = [];
  let lastSyncedAt: string | null = null;
  let totalFollowers = 0;
  let hasAudience = false;

  for (const [platform, list] of byPlatform) {
    const sorted = [...list].sort((a, b) => {
      const ta = parseDate(a.date) ?? 0;
      const tb = parseDate(b.date) ?? 0;
      if (ta !== tb) return ta - tb;
      const sa = parseDate(a.synced_at ?? "") ?? 0;
      const sb = parseDate(b.synced_at ?? "") ?? 0;
      return sa - sb;
    });

    const latest = sorted[sorted.length - 1];
    const latestDateMs = parseDate(latest.date);
    if (latestDateMs == null) continue;

    if (latest.synced_at) {
      const prev = lastSyncedAt ? parseDate(lastSyncedAt) : null;
      const curr = parseDate(latest.synced_at);
      if (curr != null && (prev == null || curr >= prev)) {
        lastSyncedAt = latest.synced_at;
      }
    }

    const windows: Record<TrendWindowKey, WindowMetrics | null> = {
      now: toWindowMetrics(latest),
      lookback_7d: null,
      lookback_1m: null,
      lookback_3m: null,
    };

    for (const [key, days] of Object.entries(LOOKBACK_DAYS) as [
      TrendWindowKey,
      number,
    ][]) {
      const snap = findLookbackSnapshot(sorted, latestDateMs, days);
      windows[key] = snap ? toWindowMetrics(snap) : null;
    }

    if (
      latest.status === "active" &&
      latest.metric_value != null &&
      AUDIENCE_LABELS.has(latest.metric_label.toLowerCase())
    ) {
      totalFollowers += latest.metric_value;
      hasAudience = true;
    }

    rows.push({
      id: platform,
      name: latest.name,
      handle: latest.handle,
      url: latest.url,
      primary_label: latest.metric_label,
      source: latest.source,
      last_synced_at: latest.synced_at,
      status: latest.status,
      windows,
    });
  }

  rows.sort((a, b) => {
    if (a.status !== b.status) return a.status === "active" ? -1 : 1;
    return (
      (b.windows.now?.primary_value ?? -1) - (a.windows.now?.primary_value ?? -1)
    );
  });

  return {
    rows,
    totalFollowers: hasAudience ? totalFollowers : null,
    lastSyncedAt,
  };
}

function parseSheetCsv(csvText: string): SocialStatsPayload {
  const table = parseCsv(csvText);
  if (table.length < 2) {
    throw new Error("Social stats CSV is empty");
  }

  const headers = table[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);
  const get = (cells: string[], name: string) => {
    const i = idx(name);
    return i >= 0 ? cells[i] : undefined;
  };

  const snapshots: SheetSnapshot[] = [];

  for (const cells of table.slice(1)) {
    const platform = (get(cells, "platform") ?? get(cells, "id") ?? "").trim();
    if (!platform || platform.toLowerCase() === "total") continue;

    const statusRaw = (get(cells, "status") ?? "active").trim().toLowerCase();
    const status: SocialStatStatus =
      statusRaw === "inactive" ? "inactive" : "active";

    snapshots.push({
      date: (get(cells, "date") ?? "").trim(),
      platform,
      name: (get(cells, "name") ?? platform).trim(),
      handle: (get(cells, "handle") ?? "").trim(),
      url: (get(cells, "url") ?? "").trim(),
      metric_label: (
        get(cells, "metric_label") ??
        get(cells, "primary_label") ??
        "Followers"
      ).trim(),
      metric_value: parseNumber(
        get(cells, "metric_value") ?? get(cells, "primary_value"),
      ),
      secondary_label: (get(cells, "secondary_label") ?? "").trim() || null,
      secondary_value: parseNumber(get(cells, "secondary_value")),
      avg_views: parseNumber(get(cells, "avg_views")),
      engagement_rate: parseNumber(
        get(cells, "engagement_rate_pct") ??
          get(cells, "engagement_rate") ??
          get(cells, "engagement_ra"),
      ),
      source: (get(cells, "source") ?? "").trim(),
      synced_at:
        (get(cells, "synced_at") ?? get(cells, "last_synced_at") ?? "").trim() ||
        null,
      status,
    });
  }

  return mapSnapshotsToPayload(snapshots);
}

const SOCIAL_STATS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdmkCRRZ7U_i7mxZvl5R-pFvQCebJa000IkerBkFhxt2e36QSJWeUJSEkK7vbRsTATTVs3Mbm6Hyj5/pub?gid=1703766040&single=true&output=csv";

export async function getSocialStats(): Promise<SocialStatsPayload> {
  try {
    const res = await fetch(SOCIAL_STATS_CSV_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "text/csv,text/plain,*/*" },
    });

    if (!res.ok) {
      throw new Error(`Social stats CSV fetch failed: ${res.status}`);
    }

    return parseSheetCsv(await res.text());
  } catch {
    return { rows: [], totalFollowers: null, lastSyncedAt: null };
  }
}

export function formatStatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatEngagementRate(value: number) {
  return `${value.toFixed(2)}%`;
}

export function formatSyncedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatAsOfDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
