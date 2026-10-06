"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { analyticsEvents, captureEvent } from "@/lib/analytics";

const NEAR_BOTTOM_THRESHOLD = 400;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const canScroll = scrollHeight > clientHeight + NEAR_BOTTOM_THRESHOLD;

      setIsVisible(canScroll && distanceFromBottom <= NEAR_BOTTOM_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    captureEvent(analyticsEvents.backToTopClicked);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-20 right-4 z-[999]"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="h-12 w-12 rounded-full border-none dark:bg-zinc-700 bg-gray-200 dark:text-white text-zinc-900 dark:hover:bg-black hover:bg-zinc-300 shadow-sm"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
