"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>("");
  const [cursorMode, setCursorMode] = useState<"default" | "pointer" | "badge" | "hidden">("default");
  const [isTouch, setIsTouch] = useState(true);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check context
      const target = (e.target as HTMLElement)?.closest("[data-cursor], a, button, .poster");
      if (target) {
        const cursorAttr = target.getAttribute("data-cursor");
        if (cursorAttr) {
          if (cursorAttr === "pull") {
            setCursorMode("badge");
            setCursorText("PULL BIT");
          } else if (cursorAttr === "audio") {
            setCursorMode("badge");
            setCursorText("AUDIO");
          } else if (cursorAttr === "view") {
            setCursorMode("badge");
            setCursorText("VIEW");
          } else {
            setCursorMode("badge");
            setCursorText(cursorAttr.toUpperCase());
          }
        } else if (target.classList.contains("poster")) {
          setCursorMode("badge");
          setCursorText("PULL BIT");
        } else {
          setCursorMode("pointer");
          setCursorText("");
        }
      } else {
        setCursorMode("default");
        setCursorText("");
      }
    };

    const onMouseLeave = () => {
      setCursorMode("hidden");
    };

    const onMouseEnter = () => {
      setCursorMode("default");
    };

    // Smooth lerp loop for the trailing ring
    const render = () => {
      const lerp = 0.16;
      ring.current.x += (mouse.current.x - ring.current.x) * lerp;
      ring.current.y += (mouse.current.y - ring.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div className={`custom-cursor custom-cursor--${cursorMode}`} aria-hidden="true">
      <div className="custom-cursor__dot" ref={dotRef} />
      <div className="custom-cursor__ring" ref={ringRef}>
        <span className="custom-cursor__text" ref={textRef}>
          {cursorText}
        </span>
      </div>
    </div>
  );
}
