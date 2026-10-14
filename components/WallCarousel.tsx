"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export type CarouselBit = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  accent: string;
};

type WallCarouselProps = {
  bits: CarouselBit[];
  cacheBust: string;
  onOpen: (bit: CarouselBit) => void;
};

function shouldUsePinnedWall() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  // Short / landscape phones: pin overflows the viewport — use swipe instead.
  if (window.innerHeight < 560) return false;
  return true;
}

export default function WallCarousel({
  bits,
  cacheBust,
  onOpen,
}: WallCarouselProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!root || !stage || !track) return;

    let ctx: gsap.Context | null = null;
    let resizeTimer: number | undefined;

    const clearPin = () => {
      ctx?.revert();
      ctx = null;
      gsap.set(track, { clearProps: "transform,x" });
      if (progress) progress.style.width = "0%";
    };

    const setup = () => {
      clearPin();

      if (!shouldUsePinnedWall()) {
        root.classList.add("wall-carousel--fallback");
        return;
      }

      root.classList.remove("wall-carousel--fallback");

      const getTravel = () =>
        Math.max(0, track.scrollWidth - stage.clientWidth + 32);

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => {
              const travel = getTravel();
              return `+=${Math.max(travel * 1.05, window.innerHeight * 1.25)}`;
            },
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) {
                progress.style.width = `${Math.round(self.progress * 100)}%`;
              }
            },
          },
        });
      }, root);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    setup();

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 140);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      clearPin();
      root.classList.remove("wall-carousel--fallback");
    };
  }, [bits.length]);

  return (
    <div className="wall-carousel" ref={rootRef}>
      <div className="wall-carousel__stage" ref={stageRef}>
        <div className="wall-carousel__track" ref={trackRef}>
          {bits.map((bit, index) => (
            <motion.button
              key={bit.id}
              type="button"
              className={`poster poster--carousel poster--tilt-${(index % 5) + 1}`}
              style={{ ["--poster-accent" as string]: bit.accent }}
              onClick={() => onOpen(bit)}
              initial={
                reduce
                  ? false
                  : { opacity: 0, y: 28, rotate: index % 2 === 0 ? -3 : 3 }
              }
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                delay: reduce ? 0 : Math.min(index * 0.03, 0.35),
                type: "spring",
                stiffness: 320,
                damping: 24,
              }}
              whileHover={reduce ? undefined : { y: -14, scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              aria-label={`Open poster for ${bit.title}`}
            >
              <span className="poster__pin" aria-hidden="true" />
              <span className="poster__tape" aria-hidden="true" />
              <span className="poster__frame">
                <img
                  className="poster__img"
                  src={`${bit.cover}?${cacheBust}`}
                  alt=""
                  draggable={false}
                />
                <span className="poster__title-strip">
                  <span className="poster__cat">{bit.subtitle}</span>
                  <span className="poster__name">{bit.title}</span>
                </span>
              </span>
              <span className="poster__shadow" aria-hidden="true" />
              <span className="poster__hint">Pull</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="wall-carousel__meta">
        <p className="wall-carousel__hint">
          Keep scrolling to walk through every poster. After the last one, the
          page continues down.
        </p>
        <div className="wall-carousel__progress" aria-hidden="true">
          <div className="wall-carousel__progress-bar" ref={progressRef} />
        </div>
        <p className="wall-carousel__count">{bits.length} posters on the wall</p>
      </div>
    </div>
  );
}
