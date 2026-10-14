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

export default function WallCarousel({
  bits,
  cacheBust,
  onOpen,
}: WallCarouselProps) {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!pin || !track) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      pin.classList.add("wall-carousel--fallback");
      return;
    }

    const getTravel = () =>
      Math.max(0, track.scrollWidth - pin.clientWidth + 48);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () =>
            `+=${Math.max(getTravel() * 1.05, window.innerHeight * 1.4)}`,
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
    }, pin);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      pin.classList.remove("wall-carousel--fallback");
    };
  }, [bits.length]);

  return (
    <div className="wall-carousel" ref={pinRef}>
      <div className="wall-carousel__stage">
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
        <div
          className="wall-carousel__progress"
          aria-hidden="true"
        >
          <div className="wall-carousel__progress-bar" ref={progressRef} />
        </div>
        <p className="wall-carousel__count">{bits.length} posters on the wall</p>
      </div>
    </div>
  );
}
