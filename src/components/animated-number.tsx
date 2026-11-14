"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { delays } from "@/lib/constants/delays";
import { useIsFirstLoad } from "@/store/loading-store";

export type AnimatedNumberVariant =
  | "auto"
  | "compact"
  | "integer"
  | "signed"
  | "percent";

type AnimatedNumberProps = {
  value: number | null;
  /** Prefer variants from server components; functions are fine from client parents. */
  format?: AnimatedNumberVariant | ((value: number) => string);
  className?: string;
  duration?: number;
};

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("en");

const variantFormatters: Record<AnimatedNumberVariant, (value: number) => string> =
  {
    auto: (value) =>
      new Intl.NumberFormat("en", {
        notation: Math.abs(value) >= 10000 ? "compact" : "standard",
        maximumFractionDigits: 1,
      }).format(value),
    compact: (value) => compactFormatter.format(value),
    integer: (value) => integerFormatter.format(Math.round(value)),
    signed: (value) => {
      const sign = value > 0 ? "+" : "";
      return `${sign}${integerFormatter.format(Math.round(value))}`;
    },
    percent: (value) => `${value.toFixed(2)}%`,
  };

function resolveFormat(
  format: AnimatedNumberProps["format"],
): (value: number) => string {
  if (typeof format === "function") return format;
  return variantFormatters[format ?? "auto"];
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AnimatedNumber({
  value,
  format = "auto",
  className,
  duration = 1.1,
}: AnimatedNumberProps) {
  const isFirstLoad = useIsFirstLoad();
  const [revealed, setRevealed] = useState(false);
  const formatValue = useMemo(() => resolveFormat(format), [format]);
  const motionValue = useMotionValue(0);
  // Server HTML keeps the real figure. The count-up still starts at zero in the browser.
  const [display, setDisplay] = useState(
    value == null ? "—" : formatValue(value),
  );

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(formatValue(latest));
  });

  useIsoLayoutEffect(() => {
    if (value == null || revealed) return;
    motionValue.set(0);
    setDisplay(formatValue(0));
  }, [value, revealed, formatValue, motionValue]);

  useEffect(() => {
    const pageDelay = isFirstLoad
      ? delays["pre-loader-first-load"]
      : delays["pre-loader"];
    const waitMs = Math.max(0, (pageDelay - 0.2) * 1000);

    const timer = window.setTimeout(() => setRevealed(true), waitMs);
    return () => window.clearTimeout(timer);
  }, [isFirstLoad]);

  useEffect(() => {
    if (value == null) {
      setDisplay("—");
      return;
    }

    if (!revealed) return;

    motionValue.set(0);
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [value, revealed, motionValue, duration, formatValue]);

  return (
    <span
      className={className}
      aria-label={value == null ? undefined : formatValue(value)}
    >
      {display}
    </span>
  );
}
