"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bitsData from "@/data/bits.json";
import WallCarousel from "@/components/WallCarousel";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { useSound, SoundWaveToggle } from "@/components/SoundSystem";
import VelocityMarquee from "@/components/VelocityMarquee";

gsap.registerPlugin(ScrollTrigger);

type Bit = (typeof bitsData.bits)[number];

const CACHE_BUST = "v28-starting-video-7s-6s";
const INTRO_HARD_STOP_MS = 6000;
const INTRO_FADE_OUT_S = 0.4;

function ScrapEyebrow({ className }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="Same Shit. Different People.">
      <p className="hero__eyebrow-copy">
        SAME SHIT.
        <br />
        DIFFERENT PEOPLE.
      </p>
      <svg
        className="hero__eyebrow-scribble"
        viewBox="0 0 220 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 10c36 6 78 8 118 3 28-3 54-8 84-6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function ScrapArrow({
  className,
  variant = "curve-down",
}: {
  className?: string;
  variant?: "curve-down" | "curve-left" | "curve-right" | "hook-down";
}) {
  if (variant === "curve-left") {
    return (
      <svg className={className} viewBox="0 0 100 80" fill="none" aria-hidden="true">
        <path
          d="M88 14C70 22 42 34 22 54"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M38 48l-20 10 6 18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "curve-right") {
    return (
      <svg className={className} viewBox="0 0 100 80" fill="none" aria-hidden="true">
        <path
          d="M12 16C30 24 58 38 78 58"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M58 52l24 10-8 16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "hook-down") {
    return (
      <svg className={className} viewBox="0 0 70 90" fill="none" aria-hidden="true">
        <path
          d="M18 8C22 28 28 48 36 68"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M22 58l16 16 18-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 120 70" fill="none" aria-hidden="true">
      <path
        d="M8 12C28 18 52 36 78 52"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M58 48l24 8-8 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PosterWall() {
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();
  const { playThud, playClick, playWhoosh } = useSound();
  const [active, setActive] = useState<Bit | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [needsTapToStart, setNeedsTapToStart] = useState(false);
  const finishIntroRef = useRef<() => void>(() => {});
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wallSceneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const openingStarted = useRef(false);
  const awaitingGesture = useRef(false);

  useEffect(() => {
    const intro = introRef.current;
    const video = videoRef.current;
    if (!intro) {
      setIntroDone(true);
      return;
    }

    document.body.classList.add("intro-open");
    stopScroll();

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(intro, { display: "none" });
      document.body.classList.remove("intro-open");
      startScroll();
      setIntroDone(true);
      return;
    }

    let endedBound = false;
    let cancelled = false;
    let hardStopTimer: ReturnType<typeof setTimeout> | undefined;

    const clearHardStop = () => {
      if (hardStopTimer !== undefined) {
        clearTimeout(hardStopTimer);
        hardStopTimer = undefined;
      }
    };

    const armHardStop = () => {
      clearHardStop();
      // Start the fade early enough that the real site is visible by the 6s mark.
      const fadeLeadMs = Math.round(INTRO_FADE_OUT_S * 1000);
      const delayMs = Math.max(0, INTRO_HARD_STOP_MS - fadeLeadMs);
      hardStopTimer = setTimeout(() => {
        finishIntro();
      }, delayMs);
    };

    const finishIntro = () => {
      if (intro.dataset.finished === "1") return;
      intro.dataset.finished = "1";
      clearHardStop();
      if (video) {
        try {
          gsap.to(video, { volume: 0, duration: INTRO_FADE_OUT_S, ease: "power2.inOut" });
        } catch {
          /* ignore */
        }
      }
      gsap.to(intro, {
        opacity: 0,
        duration: INTRO_FADE_OUT_S,
        ease: "power2.inOut",
        onComplete: () => {
          if (video) {
            try {
              video.pause();
            } catch {
              /* ignore */
            }
          }
          gsap.set(intro, { display: "none" });
          document.body.classList.remove("intro-open");
          startScroll();
          setIntroDone(true);
        },
      });
    };

    finishIntroRef.current = finishIntro;

    const onTimeUpdate = () => {
      if (!video || intro.dataset.finished === "1") return;
      if (video.currentTime >= 6.0) {
        try {
          video.pause();
        } catch {
          /* ignore */
        }
        finishIntro();
      } else if (video.currentTime >= 6.0 - INTRO_FADE_OUT_S) {
        finishIntro();
      }
    };

    const lockVideoChrome = () => {
      if (!video) return;
      video.controls = false;
      video.removeAttribute("controls");
      video.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
      video.setAttribute("disablePictureInPicture", "true");
      video.disablePictureInPicture = true;
      // Completely disable user pointer events and interaction on the media element
      video.style.pointerEvents = "none";
      video.style.userSelect = "none";
      video.oncontextmenu = (e) => e.preventDefault();
    };

    const prepareVideo = async () => {
      if (!video) return;
      video.playsInline = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.preload = "auto";
      lockVideoChrome();
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
      try {
        video.load();
      } catch {
        /* ignore */
      }
      if (video.readyState >= 3) return;
      await new Promise<void>((resolve) => {
        const done = () => {
          video.removeEventListener("canplaythrough", done);
          video.removeEventListener("loadeddata", done);
          resolve();
        };
        video.addEventListener("canplaythrough", done, { once: true });
        video.addEventListener("loadeddata", done, { once: true });
        window.setTimeout(done, 1800);
      });
    };

    const startVideoWithSound = async () => {
      if (!video) return false;
      lockVideoChrome();
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
      try {
        await video.play();
        if (video.paused || video.muted) return false;
        return true;
      } catch {
        return false;
      }
    };

    const keepIntroPlaying = () => {
      if (!video || cancelled || intro.dataset.finished === "1") return;
      if (!openingStarted.current) return;
      if (video.ended) {
        finishIntro();
        return;
      }
      if (video.paused) {
        lockVideoChrome();
        void video.play().catch(() => {
          /* browser may still block; unlock tap handles that */
        });
      }
    };

    // Curtain open slowed 50% so the parting feels cinematic and grand (~2.05s).
    const CURTAIN_OPEN_DURATION = 1.05 * 1.3 * 1.5;

    const openCurtains = () => {
      const left = intro.querySelector(".curtain-intro__curtain--left");
      const right = intro.querySelector(".curtain-intro__curtain--right");
      const stampWrap = intro.querySelector(".curtain-intro__stamp-wrap");

      gsap.to(stampWrap, {
        opacity: 0,
        y: -24,
        scale: 0.96,
        duration: 0.45,
        ease: "power2.in",
      });

      gsap.to(left, {
        xPercent: -105,
        duration: CURTAIN_OPEN_DURATION,
        ease: "power3.inOut",
      });
      gsap.to(right, {
        xPercent: 105,
        duration: CURTAIN_OPEN_DURATION,
        ease: "power3.inOut",
      });
    };

    const beginShowWithSound = async () => {
      if (openingStarted.current || cancelled) return;
      openingStarted.current = true;
      awaitingGesture.current = false;
      setNeedsTapToStart(false);

      await prepareVideo();
      if (cancelled) return;

      if (!video) {
        openCurtains();
        armHardStop();
        return;
      }

      // Keep ended as an early exit if the clip is shorter than the hard stop.
      // The hard stop and onTimeUpdate enforce the 6-second rule.
      if (!endedBound) {
        endedBound = true;
        video.addEventListener("ended", finishIntro, { once: true });
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("pause", keepIntroPlaying);
        video.addEventListener("play", lockVideoChrome);
      }

      // Start the clip and the curtain move in the same moment so they overlap,
      // instead of waiting for play to finish before the curtains begin.
      const playPromise = startVideoWithSound();
      openCurtains();
      armHardStop();

      const playing = await playPromise;
      if (cancelled) return;

      if (!playing) {
        clearHardStop();
        gsap.killTweensOf([
          intro.querySelector(".curtain-intro__curtain--left"),
          intro.querySelector(".curtain-intro__curtain--right"),
          intro.querySelector(".curtain-intro__stamp-wrap"),
        ]);
        gsap.set(intro.querySelector(".curtain-intro__curtain--left"), { xPercent: 0 });
        gsap.set(intro.querySelector(".curtain-intro__curtain--right"), { xPercent: 0 });
        gsap.set(intro.querySelector(".curtain-intro__stamp-wrap"), {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        openingStarted.current = false;
        awaitingGesture.current = true;
        setNeedsTapToStart(true);
        return;
      }
    };

    void prepareVideo();

    const stampTl = gsap.timeline({
      onComplete: () => {
        void beginShowWithSound();
      },
    });

    stampTl
      .fromTo(
        ".curtain-intro__stamp",
        { scale: 1.4, opacity: 0, rotate: -6 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: "back.out(1.7)" }
      )
      .fromTo(
        ".curtain-intro__line",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.15"
      )
      .to(".curtain-intro__stamp", {
        scale: 1.08,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
      // Brief hold so SHOW STARTS NOW lands, then the 6s show clock starts.
      .to({}, { duration: 0.28 });

    const onUnlockTap = (e?: Event) => {
      // Only proceed if waiting for initial unlock gesture; otherwise user cannot alter or restart video
      if (!awaitingGesture.current) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      void beginShowWithSound();
    };

    const blockMediaKeys = (e: KeyboardEvent) => {
      if (intro.dataset.finished === "1") return;
      if (e.code === "Space" || e.key === "k" || e.key === "K" || e.key === "MediaPlayPause") {
        e.preventDefault();
        e.stopPropagation();
        keepIntroPlaying();
      }
    };

    const preventDefaultContext = (e: Event) => e.preventDefault();

    intro.addEventListener("pointerdown", onUnlockTap);
    intro.addEventListener("keydown", onUnlockTap);
    intro.addEventListener("contextmenu", preventDefaultContext);
    window.addEventListener("keydown", blockMediaKeys, true);

    return () => {
      cancelled = true;
      clearHardStop();
      stampTl.kill();
      intro.removeEventListener("pointerdown", onUnlockTap);
      intro.removeEventListener("keydown", onUnlockTap);
      intro.removeEventListener("contextmenu", preventDefaultContext);
      window.removeEventListener("keydown", blockMediaKeys, true);
      if (video) {
        video.removeEventListener("ended", finishIntro);
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("pause", keepIntroPlaying);
        video.removeEventListener("play", lockVideoChrome);
      }
      document.body.classList.remove("intro-open");
    };
  }, [stopScroll, startScroll]);

  useEffect(() => {
    if (!introDone) return;
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero__eyebrow-svg, .hero__title .char, .hero__line, .hero__actions",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.04,
          ease: "power3.out",
        }
      );

      const floats = floatRef.current?.querySelectorAll(".hero-float__card");
      if (floats?.length) {
        gsap.fromTo(
          floats,
          { y: 80, opacity: 0, rotate: -12, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotate: (i) => (i % 2 === 0 ? -6 : 5),
            scale: 1,
            duration: 0.95,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.15,
          }
        );

        floats.forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 === 0 ? -22 : 16,
            duration: 3.4 + i * 0.28,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [introDone]);

  useEffect(() => {
    const scene = wallSceneRef.current;
    if (!scene) return;

    const ctx = gsap.context(() => {
      gsap.to(".wall-depth", {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: ".section--wall",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.fromTo(
        ".paper-tear",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".section--wall",
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
    }, scene);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      pointer.current = { x, y };

      const spot = spotlightRef.current;
      if (spot) {
        spot.style.setProperty("--sx", `${e.clientX}px`);
        spot.style.setProperty("--sy", `${e.clientY}px`);
      }

      const floats = floatRef.current?.querySelectorAll(
        ".hero-float__card"
      ) as NodeListOf<HTMLElement> | undefined;
      floats?.forEach((card, i) => {
        const depth = 8 + (i % 4) * 4;
        const dx = (x - 0.5) * depth;
        const dy = (y - 0.5) * depth * 0.7;
        card.style.setProperty("--px", `${dx}px`);
        card.style.setProperty("--py", `${dy}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (active) {
      document.body.classList.add("modal-open");
      stopScroll();
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { pointerEvents: "auto", opacity: 0 });
      gsap.to(overlay, { opacity: 1, duration: 0.32, ease: "power2.out" });

      const panel = panelRef.current;
      if (panel) {
        gsap.killTweensOf(panel);
        gsap.fromTo(
          panel,
          { y: 90, scale: 0.82, rotate: -3.2, opacity: 0 },
          {
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.55,
            ease: "back.out(1.6)",
          }
        );
        gsap.fromTo(
          ".watch-bit",
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            delay: 0.2,
            ease: "back.out(2)",
          }
        );
      }
    } else {
      document.body.classList.remove("modal-open");
      startScroll();
      gsap.killTweensOf(overlay);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, {
              pointerEvents: "none",
              opacity: 0,
            });
          }
          document.body.classList.remove("modal-open");
          startScroll();
        },
      });
    }

    return () => {
      document.body.classList.remove("modal-open");
      startScroll();
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { pointerEvents: "none", opacity: 0 });
      }
    };
  }, [active, stopScroll, startScroll]);

  const currentBitIndex = active
    ? bitsData.bits.findIndex((b) => b.id === active.id)
    : -1;

  function openModal(bit: Bit) {
    playThud();
    setActive(bit);
  }

  function closeModal() {
    playClick();
    document.body.classList.remove("modal-open");
    startScroll();
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { pointerEvents: "none", opacity: 0 });
    }
    setActive(null);
    setCopiedLink(false);
  }

  function handlePrevBit(e: React.MouseEvent) {
    e.stopPropagation();
    if (!active) return;
    const prevIdx =
      currentBitIndex > 0 ? currentBitIndex - 1 : bitsData.bits.length - 1;
    playWhoosh();
    setActive(bitsData.bits[prevIdx]);
    setCopiedLink(false);
  }

  function handleNextBit(e: React.MouseEvent) {
    e.stopPropagation();
    if (!active) return;
    const nextIdx =
      currentBitIndex < bitsData.bits.length - 1 ? currentBitIndex + 1 : 0;
    playWhoosh();
    setActive(bitsData.bits[nextIdx]);
    setCopiedLink(false);
  }

  async function handleShareBit(e: React.MouseEvent) {
    e.stopPropagation();
    if (!active) return;
    playClick();
    const url = `${window.location.origin}${window.location.pathname}#bit=${active.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        const prevIdx =
          currentBitIndex > 0 ? currentBitIndex - 1 : bitsData.bits.length - 1;
        playWhoosh();
        setActive(bitsData.bits[prevIdx]);
        setCopiedLink(false);
      } else if (e.key === "ArrowRight") {
        const nextIdx =
          currentBitIndex < bitsData.bits.length - 1 ? currentBitIndex + 1 : 0;
        playWhoosh();
        setActive(bitsData.bits[nextIdx]);
        setCopiedLink(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, currentBitIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.startsWith("#bit=")) {
      const bitId = hash.replace("#bit=", "");
      const found = bitsData.bits.find((b) => b.id === bitId);
      if (found) {
        setActive(found);
      }
    }
  }, []);


  function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const lines = [
      "Jimmy Oye booking enquire",
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Event location: ${data.get("city") || ""}`,
      `Event type: ${data.get("venue") || ""}`,
      `Details: ${data.get("message") || ""}`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    const subject = encodeURIComponent("Book Jimmy Oye — show enquire");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  const floatIds =
    "heroFloatIds" in bitsData && Array.isArray(bitsData.heroFloatIds)
      ? bitsData.heroFloatIds
      : [];
  const floatBits = (
    floatIds.length
      ? floatIds
          .map((id) => bitsData.bits.find((b) => b.id === id))
          .filter(Boolean)
      : bitsData.bits.slice(0, 5)
  ) as Bit[];
  const heroWallBits = [
    ...floatBits,
    ...bitsData.bits
      .filter((b) => !floatBits.some((f) => f.id === b.id))
      .slice(0, 10),
  ].slice(0, 12);

  const titleChars = "Jimmy Oye".split("");

  return (
    <>
      <div
        className={`curtain-intro${needsTapToStart ? " curtain-intro--awaiting" : ""}`}
        ref={introRef}
        aria-hidden={introDone}
      >
        <video
          ref={videoRef}
          className="curtain-intro__video"
          playsInline
          preload="auto"
          autoPlay={false}
          muted={false}
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Show opening advisory"
        >
          <source src={`/starting-video-7s.mp4?${CACHE_BUST}`} type="video/mp4" />
          <source src={`/starting-video-7s.webm?${CACHE_BUST}`} type="video/webm" />
        </video>
        <div className="curtain-intro__curtain curtain-intro__curtain--left" />
        <div className="curtain-intro__curtain curtain-intro__curtain--right" />
        <div className="curtain-intro__stamp-wrap">
          <div className="curtain-intro__glow" />
          <div className="curtain-intro__stamp">SHOW STARTS NOW</div>
          <p className="curtain-intro__line">Jimmy Oye · Bit Poster Wall</p>
          {needsTapToStart ? (
            <p className="curtain-intro__tap">Tap once so the show can open with sound</p>
          ) : null}
        </div>
      </div>

      <div className="spotlight" ref={spotlightRef} aria-hidden="true" />

      <nav className="site-nav">
        <a className="site-nav__brand" href="#top">
          <span className="site-nav__mark">JO</span>
          <span>Jimmy Oye</span>
        </a>
        <div className="site-nav__links">
          <a href="#bits">Bits</a>
          <a href="#about">About</a>
          <a href="#dates">Dates</a>
          <a href="#book">Book</a>
          <a href={bitsData.ticketsUrl} target="_blank" rel="noreferrer">
            Tickets
          </a>
        </div>
        <SoundWaveToggle />
      </nav>

      <header className="hero" id="top" ref={heroRef}>
        <div className="hero__paper" aria-hidden="true" />
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__floats" ref={floatRef} aria-hidden="true">
          {heroWallBits.map((bit, i) => (
            <div
              key={bit.id}
              className={`hero-float__card hero-float__card--${i + 1}`}
              style={{ ["--poster-accent" as string]: bit.accent }}
            >
              <img src={`${bit.cover}?${CACHE_BUST}`} alt="" />
              <span className="hero-float__tape" />
            </div>
          ))}
        </div>
        <div className="hero__content">
          <div className="hero__title-block">
            <ScrapEyebrow className="hero__eyebrow-svg" />
            <h1 className="hero__title" aria-label="Jimmy Oye">
              {titleChars.map((ch, i) => (
                <span className="char" key={`${ch}-${i}`}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h1>
          </div>
          <p className="hero__line">
            Scroll the full wall. Pull a bit. Feel the room.
          </p>
          <div className="hero__actions-block">
            <div className="hero__actions">
              <a className="btn btn--lemon" href="#bits">
                Walk the wall
              </a>
              <a
                className="btn btn--ink"
                href={bitsData.ticketsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get tickets
              </a>
            </div>
            <p className="hero__note hero__note--side" aria-hidden="true">
              INDIAN COMEDY
              <br />
              FOR REAL PEOPLE.
            </p>
          </div>
        </div>
        <a
          className="hero__scroll"
          href="#bits"
          aria-label="Scroll to poster wall"
        >
          <span />
          Step into the wall
        </a>
      </header>

      <div className="paper-tear" aria-hidden="true" />
      <VelocityMarquee />

      <section className="section section--wall" id="bits">
        <div className="wall-paper" aria-hidden="true" />
        <div className="wall-depth" aria-hidden="true" />
        <div className="section__head section__head--wall">
          <div className="section__head-copy">
            <h2 className="section__title">Every joke earned its poster.</h2>
            <p className="section__wall-label">The bit wall.</p>
          </div>
          <div className="scrap-mark scrap-mark--wall" aria-hidden="true">
            <p className="scrap-mark__note">START HERE</p>
            <ScrapArrow className="scrap-mark__arrow scrap-mark__arrow--wall" variant="hook-down" />
          </div>
        </div>
        <div className="wall-scene" ref={wallSceneRef}>
          <WallCarousel
            bits={bitsData.bits}
            cacheBust={CACHE_BUST}
            onOpen={(bit) => {
              const full = bitsData.bits.find((b) => b.id === bit.id);
              if (full) openModal(full);
            }}
          />
        </div>
      </section>

      <section className="section section--mic" id="about">
        <div className="who-mic">
          <div className="who-mic__copy">
            <h2 className="who-mic__title">
              WHO IS ON THE MIC<span className="who-mic__dot">.</span>
            </h2>
            <p className="who-mic__bio">
              Jimmy Oye is a stand-up comedian known for sharp observations,
              relatable stories, and pure desi energy. Everyday life, Indian
              parents, city chaos, and the thoughts that spill out on stage.
            </p>
            <div className="who-mic__stats-wrap">
              <div className="scrap-mark scrap-mark--stats" aria-hidden="true">
                <p className="scrap-mark__note">THE RECEIPTS</p>
                <ScrapArrow
                  className="scrap-mark__arrow scrap-mark__arrow--stats"
                  variant="hook-down"
                />
              </div>
              <div className="who-mic__stats" aria-label="Highlights">
                <div className="who-mic__stat">
                  <strong>100+</strong>
                  <span>SHOWS</span>
                </div>
                <div className="who-mic__stat">
                  <strong>1M+</strong>
                  <span>VIDEO VIEWS</span>
                </div>
                <div className="who-mic__stat">
                  <strong>25+</strong>
                  <span>CITIES ACROSS INDIA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="who-mic__visual">
            <div className="who-mic__callout" aria-hidden="true">
              <p className="who-mic__note who-mic__note--arrow">
                SAME STORIES.
                <br />
                DIFFERENT CITIES.
              </p>
              <ScrapArrow
                className="who-mic__arrow who-mic__arrow--main"
                variant="curve-down"
              />
            </div>

            <figure className="who-mic__polaroid">
              <span className="who-mic__tape who-mic__tape--l" aria-hidden="true" />
              <span className="who-mic__tape who-mic__tape--r" aria-hidden="true" />
              <img
                src={`/faces/mic-portrait.jpg?${CACHE_BUST}`}
                alt="Jimmy Oye on the mic"
              />
              <figcaption>
                <span className="who-mic__punch">WHAT ABOUT YOU GUYS,</span>
                <span className="who-mic__caption-line">
                  COMEDY TRAVELS BETTER TOGETHER
                  <span className="who-mic__smile" aria-hidden="true">
                    ◠‿◠
                  </span>
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="who-mic__tags-wrap">
            <div className="scrap-mark scrap-mark--tags" aria-hidden="true">
              <p className="scrap-mark__note">THE THEMES</p>
              <ScrapArrow
                className="scrap-mark__arrow scrap-mark__arrow--tags"
                variant="curve-right"
              />
            </div>
            <ul className="who-mic__tags">
              {[
                "INDIA",
                "PEOPLE",
                "CITIES",
                "PARENTS",
                "RELATIONSHIPS",
                "RANDOM THOUGHTS",
              ].map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--catch-book" id="dates">
        <div className="catch-book" id="book">
          <div className="catch-book__pane catch-book__pane--live">
            <h2 className="catch-book__title">
              CATCH HIM LIVE<span className="catch-book__dot">.</span>
            </h2>
            <p className="catch-book__lead">
              Rooms, fests, and city nights. Grab a seat when the next date drops.
            </p>
            <div className="catch-book__target catch-book__target--live">
              <div className="scrap-mark scrap-mark--live" aria-hidden="true">
                <p className="scrap-mark__note">GRAB A SEAT</p>
                <ScrapArrow
                  className="scrap-mark__arrow scrap-mark__arrow--live"
                  variant="hook-down"
                />
              </div>
              <article className="show-card">
                <p className="show-card__eyebrow">Upcoming tour dates</p>
                <div className="tour-chips">
                  {[
                    { city: "Chandigarh", venue: "Tagore Theatre", status: "Filling Fast" },
                    { city: "Mohali", venue: "The Comedy Club", status: "Tickets Live" },
                    { city: "Delhi NCR", venue: "Studio XO", status: "Announced" },
                    { city: "Bengaluru", venue: "Kala Stage", status: "Waitlist" },
                    { city: "Mumbai", venue: "Habitat", status: "Coming Soon" },
                  ].map((tour) => (
                    <div key={tour.city} className="tour-row">
                      <div className="tour-row__info">
                        <strong>{tour.city}</strong>
                        <span>{tour.venue}</span>
                      </div>
                      <span className="tour-row__status">{tour.status}</span>
                    </div>
                  ))}
                </div>
                <a
                  className="btn btn--hot show-card__cta"
                  href={bitsData.ticketsUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                >
                  Get show tickets →
                </a>
              </article>
            </div>
          </div>

          <div className="catch-book__divider" aria-hidden="true" />

          <div className="catch-book__pane catch-book__pane--book">
            <h2 className="catch-book__title">
              BOOK JIMMY<span className="catch-book__dot">.</span>
            </h2>
            <p className="catch-book__lead">
              Colleges, corporates, private shows, and club lineups. Tell us
              about the night and we open a message draft to his booking contact.
            </p>
            <div className="catch-book__target catch-book__target--book">
              <div className="scrap-mark scrap-mark--book" aria-hidden="true">
                <p className="scrap-mark__note">FOR YOUR EVENT</p>
                <ScrapArrow
                  className="scrap-mark__arrow scrap-mark__arrow--book"
                  variant="hook-down"
                />
              </div>
              <div className="booking booking--inline">
              <p className="form-note">
                Booking contact:{" "}
                <a href={bitsData.bookingUrl} target="_blank" rel="noreferrer">
                  {bitsData.bookingHandle}
                </a>
              </p>
              <form onSubmit={handleBooking}>
                <div className="form-row">
                  <label>
                    Name
                    <input name="name" required placeholder="Your name" />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Event type
                    <select name="venue" defaultValue="College fest">
                      <option>College fest</option>
                      <option>Corporate</option>
                      <option>Private show</option>
                      <option>Club / comedy room</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label>
                    Event location
                    <input name="city" required placeholder="City / venue" />
                  </label>
                </div>
                <label>
                  Details
                  <textarea
                    name="message"
                    placeholder="Date ideas, crowd size, and anything useful"
                    required
                  />
                </label>
                <input type="hidden" name="date" value="" />
                <input type="hidden" name="budget" value="" />
                <div className="booking__actions">
                  <button className="btn btn--hot" type="submit" data-cursor="click">
                    Send enquiry
                  </button>
                  <a
                    className="btn btn--whatsapp"
                    href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi Jimmy / Dhruv, I would like to enquire about booking Jimmy Oye for an event.")}`}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="click"
                  >
                    💬 WhatsApp Booking
                  </a>
                </div>
              </form>
              {formSent ? (
                <p className="form-success">
                  Enquire draft opened. Send it to the booking contact to finish.
                </p>
              ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="dj-note">
          <div>
            <strong>Also DJs</strong>
            <p className="form-note">
              Jimmy also plays club sets. Comedy stays the main story on this
              site.
            </p>
          </div>
          <a
            className="btn btn--ghost"
            href={bitsData.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </section>

      <VelocityMarquee
        direction={-1}
        className="velocity-marquee--hot"
        text="SAME SHIT · DIFFERENT CITIES · HOSTEL TO TOUR · JIMMY OYE STAND-UP · 100+ SHOWS · "
      />

      <footer className="site-footer">
        <span>Jimmy Oye · Same Shit. Different People.</span>
        <a href={bitsData.instagram} target="_blank" rel="noreferrer">
          @jimmy_oye
        </a>
      </footer>

      <div className="showrunner" role="navigation" aria-label="Quick actions">
        <a
          className="showrunner__btn showrunner__btn--tickets"
          href={bitsData.ticketsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Get tickets
        </a>
        <a className="showrunner__btn showrunner__btn--book" href="#book">
          Book Jimmy
        </a>
      </div>

      <div
        className={`overlay${active ? " is-open" : ""}`}
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) closeModal();
        }}
        aria-hidden={!active}
      >
        {active ? (
          <div
            className="poster-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} poster`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="poster-panel__media"
              style={{ ["--poster-accent" as string]: active.accent }}
            >
              <img
                className="poster-panel__img"
                src={`${active.cover}?${CACHE_BUST}`}
                alt=""
              />
              <div className="poster-panel__pulse" aria-hidden="true" />
              <a
                className="watch-bit"
                href={active.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="watch-bit__ring" aria-hidden="true" />
                <span className="watch-bit__icon" aria-hidden="true">
                  ▶
                </span>
                <span className="watch-bit__label">Watch bit</span>
              </a>
            </div>
            <div className="poster-panel__body">
              <div className="poster-panel__nav-bar">
                <button
                  type="button"
                  className="poster-panel__nav-btn"
                  onClick={handlePrevBit}
                  aria-label="Previous bit"
                  data-cursor="click"
                >
                  ← Prev
                </button>
                <span className="poster-panel__index-indicator">
                  {currentBitIndex + 1} / {bitsData.bits.length}
                </span>
                <button
                  type="button"
                  className="poster-panel__nav-btn"
                  onClick={handleNextBit}
                  aria-label="Next bit"
                  data-cursor="click"
                >
                  Next →
                </button>
                <button
                  type="button"
                  className="poster-panel__close"
                  onClick={closeModal}
                  aria-label="Close"
                  data-cursor="click"
                >
                  ×
                </button>
              </div>

              <p className="poster-panel__kicker">{active.subtitle}</p>
              <h3 className="poster-panel__title">{active.title}</h3>
              <p className="poster-panel__note">{active.note}</p>
              <div className="poster-panel__actions">
                <a
                  className="btn btn--hot"
                  href={active.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                >
                  Watch on Instagram
                </a>
                <a
                  className="btn btn--lemon"
                  href={bitsData.ticketsUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                >
                  Get tickets
                </a>
                <button
                  type="button"
                  className="btn btn--share"
                  onClick={handleShareBit}
                  data-cursor="click"
                >
                  {copiedLink ? "Link Copied! ✓" : "Share Bit 🔗"}
                </button>
                <a
                  className="btn btn--ghost"
                  href="#book"
                  onClick={closeModal}
                  data-cursor="click"
                >
                  Book Jimmy
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
