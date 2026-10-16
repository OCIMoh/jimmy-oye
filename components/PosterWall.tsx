"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bitsData from "@/data/bits.json";
import WallCarousel, { CarouselBit } from "@/components/WallCarousel";
import HeroCollage from "@/components/HeroCollage";
import CraftManifesto from "@/components/CraftManifesto";
import ThermalReceiptTour from "@/components/ThermalReceiptTour";
import BookingDispatch from "@/components/BookingDispatch";
import VelocityMarquee from "@/components/VelocityMarquee";
import { useSound } from "@/components/SoundSystem";
import { useSmoothScroll } from "@/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const CACHE_BUST = "20261016";

export type Bit = {
  id: string;
  title: string;
  subtitle: string;
  note: string;
  instagramUrl: string;
  shortcode: string;
  cover: string;
  accent: string;
};

export default function PosterWall() {
  const [active, setActive] = useState<Bit | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { playClick, playWhoosh, playMicClick } = useSound();
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();

  // Initial stage spotlight flick-on and mouse tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const spotlight = spotlightRef.current;
    if (spotlight) {
      const tl = gsap.timeline();
      tl.set(spotlight, { opacity: 0, scale: 0.85 })
        .to(spotlight, { opacity: 0.5, duration: 0.12, ease: "rough" })
        .to(spotlight, { opacity: 0.1, duration: 0.08 })
        .to(spotlight, { opacity: 0.85, duration: 0.15 })
        .to(spotlight, { opacity: 0.35, duration: 0.06 })
        .to(spotlight, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (!spotlight) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlight.style.setProperty("--spot-x", `${x}%`);
      spotlight.style.setProperty("--spot-y", `${y}%`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Modal open/close helpers
  const openModal = (bit: Bit) => {
    playWhoosh();
    setActive(bit);
    setCopiedLink(false);
    stopScroll();
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    playClick();
    setActive(null);
    startScroll();
    document.body.classList.remove("modal-open");
  };

  // Keyboard navigation inside modal
  const currentBitIndex = active
    ? bitsData.bits.findIndex((b) => b.id === active.id)
    : -1;

  const handlePrevBit = () => {
    if (currentBitIndex === -1) return;
    const prevIdx =
      currentBitIndex > 0 ? currentBitIndex - 1 : bitsData.bits.length - 1;
    playWhoosh();
    setActive(bitsData.bits[prevIdx] as Bit);
    setCopiedLink(false);
  };

  const handleNextBit = () => {
    if (currentBitIndex === -1) return;
    const nextIdx =
      currentBitIndex < bitsData.bits.length - 1 ? currentBitIndex + 1 : 0;
    playWhoosh();
    setActive(bitsData.bits[nextIdx] as Bit);
    setCopiedLink(false);
  };

  const handleShareBit = () => {
    if (!active) return;
    const url = `${window.location.origin}${window.location.pathname}#bit=${active.id}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      playClick();
      setTimeout(() => setCopiedLink(false), 2400);
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active) closeModal();
      } else if (active) {
        if (e.key === "ArrowLeft") {
          handlePrevBit();
        } else if (e.key === "ArrowRight") {
          handleNextBit();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, currentBitIndex]);

  // Deep-linking hash support
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.startsWith("#bit=")) {
      const bitId = hash.replace("#bit=", "");
      const found = bitsData.bits.find((b) => b.id === bitId);
      if (found) {
        openModal(found as Bit);
      }
    }
  }, []);

  const handleSelectBit = (bitId: string) => {
    const bitElement = document.getElementById("bits");
    if (bitElement) {
      bitElement.scrollIntoView({ behavior: "smooth" });
    }
    const found = bitsData.bits.find((b) => b.id === bitId);
    if (found) {
      setTimeout(() => {
        openModal(found as Bit);
      }, 500);
    }
  };

  return (
    <>
      {/* Dynamic Theatrical Stage Spotlight */}
      <div className="manifesto-spotlight" ref={spotlightRef} aria-hidden="true" />

      {/* -------------------------------------------------------------
          TOP NAVIGATION: OFF-WHITE / ABOUT US / CONTACTS | JIMMY OYE | TICKETS
      -------------------------------------------------------------- */}
      <header className="manifesto-nav">
        <div className="manifesto-nav__left">
          <span className="nav-mono-tag">OYE JASSI</span>
          <a href="#book" onClick={() => playClick()}>CONTACTS</a>
        </div>

        <a className="manifesto-nav__center-brand" href="#intro" onClick={() => playClick()}>
          JIMMY OYE
        </a>

        <div className="manifesto-nav__right">
          <a href="#dates" className="nav-mono-link" onClick={() => playClick()}>TOUR DATES</a>
          <a
            className="manifesto-nav__pill-btn"
            href={bitsData.ticketsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => playMicClick()}
          >
            GET TICKETS ↗
          </a>
        </div>
      </header>

      {/* -------------------------------------------------------------
          SECTION 1: THE HERO COLLAGE ARTBOARD STAGE
      -------------------------------------------------------------- */}
      <section className="manifesto-hero-stage" id="intro" ref={heroRef}>
        {/* Massive Billboard Headline in Background */}
        <div className="billboard-backdrop" aria-hidden="true">
          <div className="billboard-line-top">SAME SHIT. DIFFERENT</div>
          <div className="billboard-line-bottom">PEOPLE.</div>
        </div>

        {/* The 5-Layer Overlapping Physical Collage Cluster */}
        <div className="hero-stage-collage-wrap">
          <HeroCollage onSelectBit={handleSelectBit} />
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: PANORAMIC OVERLAPPING POSTER WALL (ALL 21 BITS)
      -------------------------------------------------------------- */}
      <WallCarousel
        bits={bitsData.bits as CarouselBit[]}
        cacheBust={CACHE_BUST}
        onOpen={(bit) => {
          const full = bitsData.bits.find((b) => b.id === bit.id) || (bit as unknown as Bit);
          if (full) openModal(full as Bit);
        }}
      />

      {/* Marquee Band 1 */}
      <VelocityMarquee
        direction={1}
        className="velocity-marquee--lime"
        text="SAME SHIT · DIFFERENT CITIES · HOSTEL TO TOUR · JIMMY OYE STAND-UP · 100+ SHOWS · "
      />

      {/* -------------------------------------------------------------
          SECTION 3: "HOW A JOKE GETS BORN" & PUNCHLINE SOUNDBOARD
      -------------------------------------------------------------- */}
      <CraftManifesto instagramUrl={bitsData.instagram} />

      {/* Marquee Band 2 (Counter Direction) */}
      <VelocityMarquee
        direction={-1}
        className="velocity-marquee--dark"
        text="NO LAPTOPS · 21 UNCENSORED BITS · REAL CROWD WORK · PULL A PASS · BOOK YOUR EVENT · "
      />

      {/* -------------------------------------------------------------
          SECTION 4: THE TOUR SCHEDULE (CONTINUOUS THERMAL RECEIPT)
      -------------------------------------------------------------- */}
      <section className="manifesto-section manifesto-section--tour" id="dates">
        <div className="manifesto-tour-head">
          <span className="manifesto-tag">TOUR DISPATCH & TICKET RESERVATION</span>
          <h2 className="manifesto-heading">SAME SHIT. DIFFERENT CITIES.</h2>
          <p className="manifesto-lead">
            Continuous nationwide comedy tour & instant thermal receipt reservation pass. Tear your seat before it's gone.
          </p>
        </div>
        <ThermalReceiptTour ticketsUrl={bitsData.ticketsUrl} />
      </section>

      {/* -------------------------------------------------------------
          SECTION 5: THE GREENROOM & BOOKING DISPATCH
      -------------------------------------------------------------- */}
      <BookingDispatch instagramUrl={bitsData.instagram} />

      {/* -------------------------------------------------------------
          MODAL INSPECTION DRAWER (For deep reel inspection)
      -------------------------------------------------------------- */}
      {active && (
        <div
          className="poster-modal-overlay"
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-bit-title"
        >
          <div className="poster-modal-backdrop" aria-hidden="true" />

          <div className="poster-modal-panel" ref={panelRef}>
            <div className="poster-panel__left">
              <div className="poster-panel__artwork-frame">
                {/* Physical flyer tape accents */}
                <div className="poster-panel__tape poster-panel__tape--tl" aria-hidden="true" />
                <div className="poster-panel__tape poster-panel__tape--tr" aria-hidden="true" />

                <img
                  src={`${active.cover}?${CACHE_BUST}`}
                  alt={active.title}
                  className="poster-panel__img"
                />

                <span className="poster-panel__tag-stamp">
                  #{String(currentBitIndex + 1).padStart(2, "0")}
                </span>

                <div className="poster-panel__artwork-hint" aria-hidden="true">
                  <span>HOVER TO REVEAL COLOR</span>
                </div>
              </div>
            </div>

            <div className="poster-panel__right">
              {/* Stepper Navigation Deck & Dedicated Close Button */}
              <div className="poster-panel__nav">
                <div className="poster-panel__stepper">
                  <button
                    type="button"
                    className="poster-panel__step-btn"
                    onClick={handlePrevBit}
                    title="Previous Routine (Left Arrow)"
                  >
                    ← PREV
                  </button>
                  <span className="poster-panel__step-count">
                    SETLIST {String(currentBitIndex + 1).padStart(2, "0")} / {String(bitsData.bits.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="poster-panel__step-btn"
                    onClick={handleNextBit}
                    title="Next Routine (Right Arrow)"
                  >
                    NEXT →
                  </button>
                </div>

                <button
                  type="button"
                  className="poster-panel__close-btn"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <span className="poster-panel__close-esc">ESC</span>
                  <span className="poster-panel__close-icon">✕</span>
                </button>
              </div>

              {/* Bit Title & Subtitle Badge */}
              <div className="poster-panel__header-group">
                <span className="poster-panel__badge">
                  {active.subtitle ? active.subtitle.toUpperCase() : "VIRAL BIT"} &bull; LIVE ROUTINE
                </span>
                <h3 id="modal-bit-title" className="poster-panel__title">
                  {active.title}
                </h3>
              </div>

              <p className="poster-panel__note">{active.note}</p>

              {/* Crowd Intel & Routine Stats Grid (Fills dead space) */}
              <div className="poster-panel__meta-grid">
                <div className="poster-panel__meta-item">
                  <span className="poster-panel__meta-label">ROOM VIBE</span>
                  <span className="poster-panel__meta-val">⚡ Unfiltered / Raw</span>
                </div>
                <div className="poster-panel__meta-item">
                  <span className="poster-panel__meta-label">RECORDING</span>
                  <span className="poster-panel__meta-val">📍 Live Club Cut</span>
                </div>
                <div className="poster-panel__meta-item">
                  <span className="poster-panel__meta-label">CATEGORY</span>
                  <span className="poster-panel__meta-val">🏷️ #{active.subtitle ? active.subtitle.replace(/\s+/g, '') : "StandupComedy"}</span>
                </div>
              </div>

              {/* Action Buttons: Primary Hero CTA + Secondary Split Row */}
              <div className="poster-panel__actions">
                <a
                  className="poster-panel__ig-btn"
                  href={active.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                >
                  <span className="poster-panel__ig-icon">▶</span>
                  <span>Watch Reel on Instagram</span>
                  <span className="poster-panel__arrow">↗</span>
                </a>

                <div className="poster-panel__secondary-actions">
                  <a
                    className="poster-panel__ticket-btn"
                    href={bitsData.ticketsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClick()}
                  >
                    🎟️ Get Tour Tickets
                  </a>

                  <button
                    type="button"
                    className="poster-panel__share-btn"
                    onClick={handleShareBit}
                  >
                    {copiedLink ? "✓ Link Copied!" : "🔗 Share Bit"}
                  </button>
                </div>
              </div>

              {/* Hotkey Helper Bar */}
              <div className="poster-panel__hotkey-bar" aria-hidden="true">
                <span>⌨️ USE ARROW KEYS [←] [→] TO FLIP &bull; [ESC] TO CLOSE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
