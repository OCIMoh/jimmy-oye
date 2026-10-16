"use client";

import React, { useRef } from "react";
import { useSound } from "@/components/SoundSystem";

export type CarouselBit = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  accent: string;
  note?: string;
  views?: string;
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
  const { playPaperHover, playTapeRip } = useSound();
  const lastClickRef = useRef(0);

  const isPointerDownRef = useRef(false);

  const handlePointerDown = () => {
    isPointerDownRef.current = true;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isPointerDownRef.current) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D gyroscopic tilt
    card.style.setProperty("--rx", `${-py * 16}deg`);
    card.style.setProperty("--ry", `${px * 16}deg`);
  };

  const handlePointerEnter = () => {
    playPaperHover();
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    isPointerDownRef.current = false;
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleBitClick = (bit: CarouselBit) => {
    const now = Date.now();
    if (now - lastClickRef.current < 250) return;
    lastClickRef.current = now;
    playTapeRip();
    onOpen(bit);
  };

  const chaosRotations = [-2.2, 2.8, -1.5, 3.1, -2.5, 1.8, -3.2, 2.4, -1.9, 2.7];
  const chaosTranslates = [0, 8, -6, 12, -8, 6, -10, 10, -4, 4];

  const renderCard = (bit: CarouselBit, index: number, copyIndex: number) => {
    const cardKey = `${bit.id}-${copyIndex}`;
    const bitIndex = String(index + 1).padStart(2, "0");
    const views = `${((index * 1.7 + 11.2) % 19 + 5).toFixed(1)}K`;

    // Every 5th card is the signature vibrant neon acid-lime shocker poster
    const isNeonPoster = (index + 1) % 5 === 0;
    const rotationAngle = `${chaosRotations[index % chaosRotations.length]}deg`;
    const translateY = `${chaosTranslates[index % chaosTranslates.length]}px`;
    const baseZIndex = (index % 5) + 1;

    return (
      <div
        key={cardKey}
        className="zine-poster-wrapper"
        style={{
          zIndex: baseZIndex,
        }}
      >
        <button
          type="button"
          className={`zine-poster-card ${
            isNeonPoster ? "zine-poster-card--neon" : "zine-poster-card--noir"
          }`}
          style={{
            ["--card-rotate" as string]: rotationAngle,
            ["--card-y" as string]: translateY,
          }}
          onClick={() => handleBitClick(bit)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          aria-label={`Open routine ${bit.title}`}
          data-cursor="view"
        >
          {isNeonPoster ? (
            /* ----------------------------------------------------
               SIGNATURE ACID-LIME SHOCKER POSTER (Every 5th Card)
            ---------------------------------------------------- */
            <div className="neon-poster-inner">
              <div className="neon-poster-top">
                <span className="neon-poster-idx">#{bitIndex}</span>
                <span className="neon-poster-flag">VIRAL SPECIAL</span>
              </div>
              <div className="neon-poster-headline">
                <span>SAME</span>
                <span>SHIT.</span>
                <span className="neon-poster-headline__huge">PEOPLE.</span>
              </div>
              <div className="neon-poster-bottom">
                <span>STAND NOIR</span>
                <span>•</span>
                <span>JIMMY OYE</span>
              </div>
            </div>
          ) : (
            /* ----------------------------------------------------
               FILM NOIR / ZINE POSTER CARD
            ---------------------------------------------------- */
            <div className="noir-poster-inner">
              {/* Top Zine Header */}
              <div className="noir-poster-header">
                <span className="noir-poster-title-lead">SAME SHIT.</span>
                <span className="noir-poster-title-sub">DIFFERENT PEOPLE.</span>
              </div>

              {/* Photo Artwork */}
              <div className="noir-poster-artwork">
                <img
                  src={`${bit.cover}?${cacheBust}`}
                  alt={bit.title}
                  className="noir-poster-img"
                  loading="lazy"
                  draggable={false}
                />
                <div className="noir-poster-grain" aria-hidden="true" />
              </div>

              {/* Bottom Metadata Bar */}
              <div className="noir-poster-meta">
                <span className="noir-poster-name">{bit.title.toUpperCase()}</span>
                <span className="noir-poster-views">
                  VIRAL REEL VIEW <span className="views-dot">●</span> {views}
                </span>
              </div>
            </div>
          )}

          {/* Tape Corners on Top */}
          <span className="zine-tape zine-tape--top" aria-hidden="true" />
        </button>
      </div>
    );
  };

  return (
    <section className="manifesto-wall-section" id="bits">
      {/* -------------------------------------------------------------
          SUBHEADER: MINIMALIST DUCT-TAPE STRIP (21 STAGE TAPES)
      -------------------------------------------------------------- */}
      <div className="manifesto-wall-header">
        <div className="manifesto-wall-header__left">
          <div className="wall-tape-brand-badge">
            <span className="wall-tape-star">★</span>
            <span className="wall-tape-brand">The Wall</span>
            <span className="wall-tape-sep">//</span>
          </div>

          <div className="wall-tape-rule-wrap" aria-hidden="true">
            <div className="wall-tape-rule" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          INFINITE CONVEYOR POSTER WALL (Continuous Marquee Loop)
      -------------------------------------------------------------- */}
      <div className="panoramic-wall-strip">
        <div className="infinite-poster-ticker">
          <div className="infinite-poster-track">
            {/* Primary Set (21 Comedy Bits) */}
            <div className="infinite-poster-group">
              {bits.map((bit, index) => renderCard(bit, index, 0))}
            </div>

            {/* Seamless Infinite Duplicate Set */}
            <div className="infinite-poster-group" aria-hidden="true">
              {bits.map((bit, index) => renderCard(bit, index, 1))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
