"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollApi = {
  stop: () => void;
  start: () => void;
  enabled: boolean;
};

const SmoothScrollContext = createContext<SmoothScrollApi>({
  stop: () => undefined,
  start: () => undefined,
  enabled: false,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

function shouldEnableLenis() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  // Keep native phone / touch scroll. Only polish fine-pointer desktop.
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(max-width: 900px)").matches) return false;
  return true;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    if (!shouldEnableLenis()) {
      enabledRef.current = false;
      document.documentElement.classList.remove("has-lenis");
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.92,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    enabledRef.current = true;
    document.documentElement.classList.add("has-lenis");

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!shouldEnableLenis()) {
          lenis.stop();
          document.documentElement.classList.remove("has-lenis");
          enabledRef.current = false;
        } else {
          lenis.start();
          document.documentElement.classList.add("has-lenis");
          enabledRef.current = true;
        }
        ScrollTrigger.refresh();
      }, 140);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      enabledRef.current = false;
      document.documentElement.classList.remove("has-lenis");
    };
  }, []);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      enabled: enabledRef.current,
      stop: () => {
        lenisRef.current?.stop();
      },
      start: () => {
        if (!enabledRef.current && !shouldEnableLenis()) return;
        lenisRef.current?.start();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
    }),
    []
  );

  return (
    <SmoothScrollContext.Provider value={api}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
