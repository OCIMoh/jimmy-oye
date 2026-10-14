"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";

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

function usePageSize() {
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 700) setPageSize(2);
      else if (w < 1100) setPageSize(3);
      else setPageSize(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return pageSize;
}

export default function WallCarousel({
  bits,
  cacheBust,
  onOpen,
}: WallCarouselProps) {
  const pageSize = usePageSize();
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  const pageCount = Math.max(1, Math.ceil(bits.length / pageSize));

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const pageBits = useMemo(() => {
    const start = page * pageSize;
    return bits.slice(start, start + pageSize);
  }, [bits, page, pageSize]);

  const goTo = useCallback(
    (next: number, dir: number) => {
      const wrapped = ((next % pageCount) + pageCount) % pageCount;
      setDirection(dir);
      setPage(wrapped);
    },
    [pageCount]
  );

  const next = useCallback(() => goTo(page + 1, 1), [goTo, page]);
  const prev = useCallback(() => goTo(page - 1, -1), [goTo, page]);

  useEffect(() => {
    if (paused || reduce || pageCount <= 1) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setPage((p) => (p + 1) % pageCount);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, reduce, pageCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    if (swipe < -70 || velocity < -500) next();
    else if (swipe > 70 || velocity > 500) prev();
  };

  const enterX = direction >= 0 ? 88 : -88;
  const exitX = direction >= 0 ? -88 : 88;

  return (
    <div
      className="wall-carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="wall-carousel__stage">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={`page-${page}-${pageSize}`}
            className="wall-carousel__page"
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: enterX, scale: 0.94, filter: "blur(6px)" }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: exitX, scale: 0.92, filter: "blur(6px)" }
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.85,
            }}
          >
            {pageBits.map((bit, index) => (
              <motion.button
                key={bit.id}
                type="button"
                className={`poster poster--carousel poster--tilt-${(index % 5) + 1}`}
                style={{ ["--poster-accent" as string]: bit.accent }}
                onClick={() => onOpen(bit)}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, y: 36, rotate: index % 2 === 0 ? -4 : 4 }
                }
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  delay: reduce ? 0 : 0.05 + index * 0.07,
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wall-carousel__controls">
        <button
          type="button"
          className="wall-carousel__nav"
          onClick={prev}
          aria-label="Previous posters"
        >
          ←
        </button>
        <div className="wall-carousel__dots" role="tablist" aria-label="Poster pages">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              className={`wall-carousel__dot${i === page ? " is-active" : ""}`}
              onClick={() => goTo(i, i > page ? 1 : -1)}
              aria-label={`Show poster set ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="wall-carousel__nav"
          onClick={next}
          aria-label="Next posters"
        >
          →
        </button>
      </div>
      <p className="wall-carousel__hint">
        Swipe or use the arrows. Posters slide out and the next set walks in.
      </p>
    </div>
  );
}
