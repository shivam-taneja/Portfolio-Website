"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

import { delays } from "@/lib/constants/delays";
import { useIsFirstLoad } from "@/store/loading-store";

type AnimatedNumberProps = {
  value: number | null;
  format?: (value: number) => string;
  className?: string;
  duration?: number;
};

const defaultFormat = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: Math.abs(value) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

export default function AnimatedNumber({
  value,
  format = defaultFormat,
  className,
  duration = 1.1,
}: AnimatedNumberProps) {
  const isFirstLoad = useIsFirstLoad();
  const [revealed, setRevealed] = useState(false);
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(value == null ? "—" : format(0));

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(format(latest));
  });

  useEffect(() => {
    // Start while the GSAP reveal is still running (slightly before content
    // becomes readable) so you never catch the counter sitting at 0.
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

    if (!revealed) {
      setDisplay(format(0));
      motionValue.set(0);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [value, revealed, motionValue, duration, format]);

  return (
    <span
      className={className}
      aria-label={value == null ? undefined : format(value)}
    >
      {display}
    </span>
  );
}
