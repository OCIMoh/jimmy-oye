"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion } from "motion/react";
import { useSound } from "@/components/SoundSystem";

interface HeroCollageProps {
  onSelectBit?: (bitId: string) => void;
}

export default function HeroCollage({ onSelectBit }: HeroCollageProps) {
  const { playClick, playPaperTear, playMicClick, playTapeRip, playPunch } = useSound();
  const [activeSetlistItem, setActiveSetlistItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flyerBwRef = useRef<HTMLDivElement>(null);
  const flyerNeonRef = useRef<HTMLDivElement>(null);
  const sketchbookRef = useRef<HTMLDivElement>(null);
  const stagePhotoRef = useRef<HTMLDivElement>(null);
  const tapeBrandRef = useRef<HTMLDivElement>(null);
  const tapeShitRef = useRef<HTMLDivElement>(null);
  const stickyYellowRef = useRef<HTMLDivElement>(null);
  const stickyPinkRef = useRef<HTMLDivElement>(null);
  const collageContainerRef = useRef<HTMLDivElement>(null);

  const isDraggingYellow = useRef(false);
  const isDraggingPink = useRef(false);
  const isDraggingShit = useRef(false);
  const isDraggingBrand = useRef(false);

  const pointerPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const screenFactorRef = useRef(1);

  const setlistRoutines = [
    { id: "sleeping-naked", title: "01. Sleeping Naked", note: "crowd favorite" },
    { id: "arts-students", title: "02. Arts vs Engineers", note: "hostel chaos" },
    { id: "baniyas-are-intelligent", title: "03. Baniya Math & Calc", note: "sharp timing" },
    { id: "panjabis-english", title: "04. Panjabis & English", note: "language bit" },
    { id: "girls-vs-boys", title: "05. Girls vs Boys Logic", note: "crowd hook" },
    { id: "unhealthy-trend", title: "06. 75 Hard Unhealthy", note: "fitness roast" },
    { id: "bangalore-diaries", title: "07. Bangalore Tech Traffic", note: "closer" },
  ];

  // Screen-size responsive physics factor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScreenFactor = () => {
      const w = window.innerWidth;
      if (w > 1300) {
        screenFactorRef.current = 1.0;
      } else if (w > 768) {
        screenFactorRef.current = 0.6;
      } else {
        screenFactorRef.current = 0.3;
      }
    };

    updateScreenFactor();
    window.addEventListener("resize", updateScreenFactor, { passive: true });
    return () => window.removeEventListener("resize", updateScreenFactor);
  }, []);

  // Pointer tracking & 60fps Asymmetric Physics Engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / h - 0.5) * 2; // -1 to 1
      pointerPos.current = { x: nx, y: ny };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const sf = screenFactorRef.current;

      // Smooth physics lerp
      currentPos.current.x += (pointerPos.current.x - currentPos.current.x) * 0.065;
      currentPos.current.y += (pointerPos.current.y - currentPos.current.y) * 0.065;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      // Ambient organic floating sine waves
      const floatBwY = Math.sin(elapsed * 1.5) * 3.5 * sf;
      const floatNeonY = Math.cos(elapsed * 1.9 + 0.7) * 4.5 * sf;
      const floatSketchY = Math.sin(elapsed * 1.3 + 1.5) * 2.5 * sf;
      const floatPhotoY = Math.cos(elapsed * 1.7 + 2.2) * 4.0 * sf;
      const floatYellowY = Math.sin(elapsed * 2.1 + 0.4) * 3.0 * sf;
      const floatPinkY = Math.cos(elapsed * 1.6 + 1.8) * 4.2 * sf;

      // 1. Artifact 1: B&W Flyer (Far Left, Low Stagger, base -7.5deg)
      if (flyerBwRef.current) {
        const tx = cx * -18 * sf;
        const ty = cy * -14 * sf + floatBwY;
        const rot = -7.5 + cx * 2.8 * sf;
        flyerBwRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      // 2. Artifact 2: Neon Flyer (Mid-Left, High Stagger, base +4.5deg)
      if (flyerNeonRef.current) {
        const tx = cx * 22 * sf;
        const ty = cy * 16 * sf + floatNeonY;
        const rot = 4.5 - cx * 3.2 * sf;
        flyerNeonRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      // 3. Artifact 3: Wire-O Sketchbook (Centerpiece Anchor with 3D gyroscopic tilt)
      if (sketchbookRef.current) {
        const tx = cx * -8 * sf;
        const ty = cy * -6 * sf + floatSketchY;
        const rx = -cy * 6.5 * sf;
        const ry = cx * 7.5 * sf;
        sketchbookRef.current.style.transform = `perspective(1000px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      // 4. Artifact 4: Candid 35mm Stage Photo (Right, Wide Shift, base -2.0deg)
      if (stagePhotoRef.current) {
        const tx = cx * 26 * sf;
        const ty = cy * -20 * sf + floatPhotoY;
        const rot = -2.0 + cx * 3.5 * sf;
        stagePhotoRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      // 5. Tape & Decals (Following stage photo when not being manually dragged)
      if (tapeBrandRef.current && !isDraggingBrand.current) {
        const tx = cx * 26 * sf;
        const ty = cy * -20 * sf + floatPhotoY;
        const rot = -8.5 + cx * 2.0 * sf;
        tapeBrandRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      if (tapeShitRef.current && !isDraggingShit.current) {
        const tx = cx * 26 * sf;
        const ty = cy * -20 * sf + floatPhotoY;
        const rot = 4.5 + cx * 1.5 * sf;
        tapeShitRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      // 6. Artifact 6: Sticky Note 1 (Yellow Post-It - Center-Bottom Stagger when not dragged)
      if (stickyYellowRef.current && !isDraggingYellow.current) {
        const tx = cx * 16 * sf;
        const ty = cy * 12 * sf + floatYellowY;
        const rot = 6.5 + cx * 2.5 * sf;
        stickyYellowRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      // 7. Artifact 7: Sticky Note 2 (Hot Pink Hotel Memo - Wide Right Bridge when not dragged)
      if (stickyPinkRef.current && !isDraggingPink.current) {
        const tx = cx * 34 * sf;
        const ty = cy * -24 * sf + floatPinkY;
        const rot = -5.0 + cx * 3.0 * sf;
        stickyPinkRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Tactile click impulse for posters & photos
  const handleCardClick = (ref: React.RefObject<HTMLDivElement>, soundFn: () => void) => {
    soundFn();
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { scale: 1.05 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }
    );
  };

  // Sticky Note Easter Egg Click Interaction
  const handleStickyClick = (
    ref: React.RefObject<HTMLDivElement>,
    quote: string,
    soundFn: () => void
  ) => {
    soundFn();
    playPunch();
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { scale: 1.1, rotate: "+=4deg" },
        { scale: 1, duration: 0.6, ease: "elastic.out(1.4, 0.3)" }
      );
    }

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(quote);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleRoutineClick = (id: string) => {
    setActiveSetlistItem(id);
    playPaperTear();
    if (onSelectBit) {
      onSelectBit(id);
    } else {
      const el = document.getElementById("bits");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={collageContainerRef}
      className="hero-collage"
      aria-label="Jimmy Oye Stage Collage and Raw Setlist"
    >
      {/* Floating Interactive Easter Egg Toast */}
      {toastMessage && (
        <div
          className="hero-easter-toast"
          style={{
            left: "50%",
            top: "8%",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* -------------------------------------------------------------
          ARTIFACT 1: B&W STREET GIG FLYER (Far Left, Low Stagger -7.5deg)
      -------------------------------------------------------------- */}
      <div
        ref={flyerBwRef}
        className="collage-artifact flyer-bw"
        onClick={() => handleCardClick(flyerBwRef, playTapeRip)}
        data-cursor="view"
      >
        <div className="tape-sticker tape-sticker--neon tape-sticker--top-left">
          SHIT.
        </div>

        <div className="barcode-sticker barcode-sticker--left">
          <svg className="barcode-svg" viewBox="0 0 100 36" fill="currentColor">
            <rect x="0" y="0" width="3" height="36" />
            <rect x="5" y="0" width="2" height="36" />
            <rect x="9" y="0" width="4" height="36" />
            <rect x="16" y="0" width="2" height="36" />
            <rect x="20" y="0" width="5" height="36" />
            <rect x="28" y="0" width="2" height="36" />
            <rect x="33" y="0" width="4" height="36" />
            <rect x="39" y="0" width="2" height="36" />
            <rect x="43" y="0" width="6" height="36" />
            <rect x="51" y="0" width="2" height="36" />
            <rect x="56" y="0" width="3" height="36" />
            <rect x="62" y="0" width="5" height="36" />
            <rect x="70" y="0" width="2" height="36" />
            <rect x="74" y="0" width="4" height="36" />
            <rect x="80" y="0" width="3" height="36" />
            <rect x="86" y="0" width="5" height="36" />
            <rect x="94" y="0" width="3" height="36" />
          </svg>
          <span className="barcode-number">12550 03059</span>
        </div>

        <div className="flyer-bw__header">
          <span className="flyer-bw__title">JIMMY OYE.</span>
          <span className="flyer-bw__sub">DIFFERENT PEOPLE.</span>
        </div>

        <div className="flyer-bw__badge">AUTHENTIC STANDUP COMEDY</div>

        <div className="flyer-bw__image-wrap">
          <Image
            src="/faces/mic-portrait.jpg"
            alt="Jimmy Oye on Stage"
            fill
            sizes="180px"
            className="flyer-bw__image"
          />
        </div>

        <div className="flyer-bw__footer">
          <div className="flyer-bw__date">SATURDAY, MAY 2026</div>
          <div className="flyer-bw__venue">CHANDIGARH // LIVE ARCHIVE</div>
        </div>

        <div className="tape-silver tape-silver--bottom" />
      </div>

      {/* -------------------------------------------------------------
          ARTIFACT 2: NEON ACID-LIME TOUR POSTER (Mid-Left, High Stagger +4.5deg)
      -------------------------------------------------------------- */}
      <div
        ref={flyerNeonRef}
        className="collage-artifact flyer-neon"
        onClick={() => handleCardClick(flyerNeonRef, playPaperTear)}
        data-cursor="view"
      >
        <div className="flyer-neon__top-tag">STANDUP COMEDY TOUR</div>
        <div className="flyer-neon__brand">JIMMY OYE</div>
        <div className="flyer-neon__burst-tag">TOUR 2026</div>

        <div className="flyer-neon__image-wrap">
          <Image
            src="/faces/sleeping-naked.jpg"
            alt="Jimmy Oye Tour Portrait"
            fill
            sizes="160px"
            className="flyer-neon__image"
          />
          <div className="flyer-neon__halftone-overlay" />
        </div>

        <div className="flyer-neon__specs">
          <span>UNCENSORED</span>
          <span>•</span>
          <span>LIVE RHYTHM</span>
        </div>

        <div className="tape-clear tape-clear--top-right" />
      </div>

      {/* -------------------------------------------------------------
          ARTIFACT 3: WIRE-O DOUBLE SPIRAL OPEN SKETCHBOOK (Centerpiece Anchor)
      -------------------------------------------------------------- */}
      <div ref={sketchbookRef} className="collage-artifact wire-o-sketchbook">
        <div className="wire-o-binding" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="wire-loop">
              <span className="wire-hole" />
              <span className="wire-metal-ring" />
              <span className="wire-hole" />
            </div>
          ))}
        </div>

        <div className="sketchbook-page">
          <div className="sketchbook-page__header">
            <div className="sketchbook-title-stamp">SETLIST</div>
            <span className="sketchbook-page__venue">HOTEL ROOM 402 • 18:30</span>
          </div>

          <div className="sketchbook-routines-list">
            {setlistRoutines.map((routine) => (
              <button
                key={routine.id}
                type="button"
                onClick={() => handleRoutineClick(routine.id)}
                className={`sketchbook-line ${
                  activeSetlistItem === routine.id ? "sketchbook-line--active" : ""
                }`}
                title={`Jump to ${routine.title}`}
              >
                <span className="sketchbook-line__title">{routine.title}</span>
                <span className="sketchbook-line__note">[{routine.note}]</span>
              </button>
            ))}
          </div>

          <div className="sketchbook-annotation" aria-hidden="true">
            <span className="sketchbook-annotation__text">Shanghe note ↗ Jokes hot!</span>
            <svg
              className="sketchbook-annotation__arrow"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 18 C 14 18, 22 8, 36 6 M 30 2 L 36 6 L 31 11" />
            </svg>
          </div>

          <div className="sketchbook-annotation-bottom" aria-hidden="true">
            <span className="sketchbook-crossed">~~Airplane food bit (drop)~~</span>
            <span className="sketchbook-sign">SET OK 2026 // Jimmy Oye</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          ARTIFACT 6: STICKY NOTE 1 (Yellow Post-It Punchline - Draggable Spring Physics)
      -------------------------------------------------------------- */}
      <motion.div
        ref={stickyYellowRef}
        className="sticky-note-yellow"
        drag
        dragConstraints={collageContainerRef}
        dragElastic={0.25}
        whileDrag={{
          scale: 1.15,
          zIndex: 100,
          rotate: 10,
          cursor: "grabbing",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.75)",
        }}
        whileHover={{ scale: 1.05, cursor: "grab" }}
        onDragStart={() => {
          isDraggingYellow.current = true;
          playTapeRip();
        }}
        onClick={() =>
          handleStickyClick(
            stickyYellowRef,
            "“Maine Google Map khola... saara RED tha bhai!” 🔥",
            playTapeRip
          )
        }
        title="⚡ Drag me around or click to fire joke"
        data-cursor="punch"
      >
        <div className="sticky-note-pin" />
        <span className="sticky-note-yellow__tag">JOKE NOTE #01 • DRAGGABLE</span>
        <p className="sticky-note-yellow__text">
          Maine Google Map khola... saara RED tha bhai!
        </p>
        <span className="sticky-note-yellow__sub">TAP TO FIRE / DRAG →</span>
      </motion.div>

      {/* -------------------------------------------------------------
          ARTIFACT 4: CANDID 35MM FILM STAGE PHOTOGRAPH (Right, Wide Shift)
      -------------------------------------------------------------- */}
      <div
        ref={stagePhotoRef}
        className="collage-artifact stage-photo"
        onClick={() => handleCardClick(stagePhotoRef, playMicClick)}
        data-cursor="view"
      >
        <div className="tape-silver tape-silver--top" />

        <div className="stage-photo__frame">
          <div className="stage-photo__img-wrap">
            <Image
              src="/faces/mic-portrait.jpg"
              alt="Jimmy Oye Live Mic Moment"
              fill
              sizes="240px"
              priority
              className="stage-photo__img"
            />
          </div>
        </div>

        <div className="barcode-sticker barcode-sticker--photo">
          <svg className="barcode-svg" viewBox="0 0 80 24" fill="currentColor">
            <rect x="0" y="0" width="2" height="24" />
            <rect x="4" y="0" width="3" height="24" />
            <rect x="9" y="0" width="1" height="24" />
            <rect x="12" y="0" width="4" height="24" />
            <rect x="18" y="0" width="2" height="24" />
            <rect x="22" y="0" width="5" height="24" />
            <rect x="30" y="0" width="2" height="24" />
            <rect x="35" y="0" width="3" height="24" />
            <rect x="40" y="0" width="2" height="24" />
            <rect x="44" y="0" width="4" height="24" />
            <rect x="50" y="0" width="2" height="24" />
            <rect x="54" y="0" width="5" height="24" />
            <rect x="62" y="0" width="2" height="24" />
            <rect x="66" y="0" width="4" height="24" />
            <rect x="73" y="0" width="3" height="24" />
          </svg>
          <span className="barcode-number">12550 00551</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          ARTIFACT 5: DECALS & TAPE (Draggable Stage Props)
      -------------------------------------------------------------- */}
      <motion.div
        ref={tapeShitRef}
        className="tape-sticker tape-sticker--neon-right"
        drag
        dragConstraints={collageContainerRef}
        dragElastic={0.25}
        whileDrag={{ scale: 1.22, zIndex: 110, rotate: 12, cursor: "grabbing" }}
        whileHover={{ scale: 1.08, cursor: "grab" }}
        onDragStart={() => {
          isDraggingShit.current = true;
          playClick();
        }}
        onClick={() => handleCardClick(tapeShitRef, playClick)}
        title="Drag tape decal"
      >
        SHIT.
      </motion.div>

      <motion.div
        ref={tapeBrandRef}
        className="tape-duct-brand"
        drag
        dragConstraints={collageContainerRef}
        dragElastic={0.25}
        whileDrag={{ scale: 1.18, zIndex: 110, rotate: -10, cursor: "grabbing" }}
        whileHover={{ scale: 1.08, cursor: "grab" }}
        onDragStart={() => {
          isDraggingBrand.current = true;
          playMicClick();
        }}
        onClick={() => handleCardClick(tapeBrandRef, playMicClick)}
        title="Jimmy Oye • Drag tape label"
      >
        <span className="tape-duct-brand__text">JIMMY OYE</span>
      </motion.div>

      {/* -------------------------------------------------------------
          ARTIFACT 7: STICKY NOTE 2 (Hot Pink Hotel Room Memo - Draggable Spring Physics)
      -------------------------------------------------------------- */}
      <motion.div
        ref={stickyPinkRef}
        className="sticky-note-pink"
        drag
        dragConstraints={collageContainerRef}
        dragElastic={0.25}
        whileDrag={{
          scale: 1.15,
          zIndex: 100,
          rotate: -8,
          cursor: "grabbing",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.75)",
        }}
        whileHover={{ scale: 1.05, cursor: "grab" }}
        onDragStart={() => {
          isDraggingPink.current = true;
          playTapeRip();
        }}
        onClick={() =>
          handleStickyClick(
            stickyPinkRef,
            "“Room 402 Memo: Show 8 PM. No laptops allowed.” ⚡",
            playClick
          )
        }
        title="⚡ Drag me around or click backstage memo"
        data-cursor="punch"
      >
        <div className="sticky-note-tape-pink" />
        <span className="sticky-note-pink__header">ROOM 402 MEMO • DRAGGABLE</span>
        <p className="sticky-note-pink__text">
          Tonight: 8:00 PM Sharp. No laptops allowed. Only pure crowd work!
        </p>
        <span className="sticky-note-pink__sign">~ Jimmy Oye</span>
      </motion.div>
    </div>
  );
}
