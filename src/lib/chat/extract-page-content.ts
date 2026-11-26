import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

/** Paths that are noisy or go stale quickly — skip for Mem0. */
const SKIP_PATHNAMES = new Set(["/stats", "/socials"]);

const CHROME_LINK_TEXT = [
  /^back to home$/i,
  /^skip to main content$/i,
  /^view site stats$/i,
  /^view social stats$/i,
  /^view more$/i,
];

const LINK_REWRITES: { match: RegExp; label: string }[] = [
  { match: /view live/i, label: "Live project" },
  { match: /view (on )?github|view source/i, label: "Source" },
  { match: /read the (blog|write-?up|article)/i, label: "Write-up" },
];

const CONTENT_SELECTOR = "h1, h2, h3, h4, h5, h6, p, li";

const BLOCK_SELECTOR =
  "h1, h2, h3, h4, h5, h6, p, li, div, section, article, br, tr, blockquote";

/** Bare list indexes like "1." left behind when titles live in sibling links. */
const BARE_INDEX = /^\d+\.?$/;

export function shouldSkipIngestUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, "") || "/";
    return SKIP_PATHNAMES.has(pathname);
  } catch {
    return false;
  }
}

function isElement(node: AnyNode): node is Element {
  return node.type === "tag";
}

function cleanPart(text: string): string {
  return text
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * cheerio .text() glues adjacent blocks/spans. Insert breaks first.
 */
function spacedText(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<AnyNode>,
): string {
  const clone = $el.clone();
  clone.find("br").replaceWith("\n");
  clone.find(BLOCK_SELECTOR).each((_, node) => {
    if (!isElement(node)) return;
    $(node).append("\n");
  });
  // Separate inline bits (company | role, sr-only descriptions, etc.)
  clone.find("span, time, strong, em, label").each((_, node) => {
    if (!isElement(node)) return;
    $(node).before(" ");
    $(node).after(" ");
  });
  return cleanPart(
    clone
      .text()
      .replace(/[ \t\f\v]+/g, " ")
      .replace(/\n+/g, "\n")
      .replace(/ *\n */g, "\n"),
  );
}

/**
 * Pull readable page copy for Mem0: drop chrome, keep facts + useful links,
 * separate blocks so words don't glue together.
 */
export function extractPageContent(html: string): string {
  const $ = cheerio.load(html);

  $(
    "script, style, noscript, iframe, svg, form, [aria-hidden='true']",
  ).remove();

  const root = $("main").length ? $("main").first() : $("body");
  root.find("nav, footer, header").remove();

  // Keep labeled buttons (e.g. home "Chatbot" title); drop empty/icon-only ones
  root.find("button").each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, " ").trim();
    if (text) {
      $el.replaceWith(` ${text} `);
    } else {
      $el.remove();
    }
  });

  root.find("a").each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, " ").trim();
    const href = ($el.attr("href") || "").trim();

    if (!text) {
      $el.remove();
      return;
    }

    if (CHROME_LINK_TEXT.some((re) => re.test(text))) {
      $el.remove();
      return;
    }

    for (const rule of LINK_REWRITES) {
      if (rule.match.test(text) && /^https?:\/\//i.test(href)) {
        $el.replaceWith(`\n${rule.label}: ${href}\n`);
        return;
      }
    }

    // Keep useful link labels as plain text (project/cert/mentorship titles)
    $el.replaceWith(` ${text} `);
  });

  const contentRoot = root.find("article").length
    ? root.find("article").first()
    : root;

  const parts: string[] = [];
  const skipNodes = new Set<AnyNode>();

  contentRoot.find(CONTENT_SELECTOR).each((_, el) => {
    if (skipNodes.has(el)) return;

    const $el = $(el);

    // Card-style <li> with nested blocks: take the whole item once
    if ($el.is("li") && $el.find(CONTENT_SELECTOR).length > 0) {
      const text = spacedText($, $el);
      if (text && !BARE_INDEX.test(text)) {
        parts.push(text);
      }
      $el.find(CONTENT_SELECTOR).each((_, child) => {
        skipNodes.add(child);
      });
      return;
    }

    const text = spacedText($, $el);
    if (!text || BARE_INDEX.test(text)) return;
    parts.push(text);
  });

  if (parts.length === 0) {
    return spacedText($, contentRoot);
  }

  const deduped: string[] = [];
  for (const part of parts) {
    if (deduped[deduped.length - 1] === part) continue;
    deduped.push(part);
  }

  return deduped.join("\n");
}
