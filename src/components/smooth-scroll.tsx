"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { useIsFirstLoad, useSetFirstLoad } from "@/store/loading-store";

import { BackToTop } from "./back-to-top";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  const countRef = useRef(0);
  const pathname = usePathname();

  const isFirstLoad = useIsFirstLoad();
  const setIsFirstLoad = useSetFirstLoad();

  useEffect(() => {
    if (countRef.current > 1 && isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      countRef.current += 1;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <ToastContainer
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        newestOnTop
        position="top-right"
      />

      {children}

      <BackToTop />

      <div className="right-4 hidden xl:block fixed xl:top-6 z-[999]">
        <ThemeToggle />
      </div>
    </>
  );
};

export default SmoothScroll;
