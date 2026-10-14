"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bitsData from "@/data/bits.json";
import WallCarousel from "@/components/WallCarousel";

gsap.registerPlugin(ScrollTrigger);

type Bit = (typeof bitsData.bits)[number];

const CACHE_BUST = "v10-wall-carousel";

export default function PosterWall() {
  const [active, setActive] = useState<Bit | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wallSceneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) {
      setIntroDone(true);
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(intro, { display: "none" });
      setIntroDone(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(intro, { display: "none" });
        setIntroDone(true);
      },
    });

    tl.fromTo(
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
      .to(
        intro,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.85,
          ease: "power3.inOut",
        },
        "+=0.35"
      )
      .to(
        ".curtain-intro__glow",
        { opacity: 0, duration: 0.4 },
        "<"
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!introDone) return;
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero__eyebrow, .hero__title .char, .hero__line, .hero__actions",
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
      gsap.to(scene, {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".wall-depth", {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
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
        },
      });
    }

    return () => {
      document.body.classList.remove("modal-open");
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { pointerEvents: "none", opacity: 0 });
      }
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeModal() {
    document.body.classList.remove("modal-open");
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { pointerEvents: "none", opacity: 0 });
    }
    setActive(null);
  }

  function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const lines = [
      "Jimmy Oye booking enquire",
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `City: ${data.get("city") || ""}`,
      `Date: ${data.get("date") || ""}`,
      `Venue type: ${data.get("venue") || ""}`,
      `Budget note: ${data.get("budget") || ""}`,
      `Message: ${data.get("message") || ""}`,
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
      .slice(0, 3),
  ].slice(0, 8);

  const titleChars = "Jimmy Oye".split("");

  return (
    <>
      <div className="curtain-intro" ref={introRef} aria-hidden="true">
        <div className="curtain-intro__glow" />
        <div className="curtain-intro__stamp">SHOW STARTS NOW</div>
        <p className="curtain-intro__line">Jimmy Oye · Bit Poster Wall</p>
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
          <span className="hero__eyebrow">Immersive Showroom</span>
          <h1 className="hero__title" aria-label="Jimmy Oye">
            {titleChars.map((ch, i) => (
              <span className="char" key={`${ch}-${i}`}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>
          <p className="hero__line">
            Walk the carousel wall. Pull a bit. Feel the room.
          </p>
          <div className="hero__actions">
            <a className="btn btn--lemon" href="#bits">
              Spin the wall
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

      <section className="section section--wall" id="bits">
        <div className="wall-paper" aria-hidden="true" />
        <div className="wall-depth" aria-hidden="true" />
        <div className="section__head">
          <p className="section__kicker">The wall carousel</p>
          <h2 className="section__title">Posters come and go.</h2>
          <p className="section__text">
            The wall now moves like a show reel. One set of posters leaves, the
            next set walks in. Swipe, tap the arrows, or let it roll — then pull
            any poster open.
          </p>
        </div>
        <div className="wall-scene" ref={wallSceneRef}>
          <WallCarousel
            bits={bitsData.bits}
            cacheBust={CACHE_BUST}
            onOpen={(bit) => {
              const full = bitsData.bits.find((b) => b.id === bit.id);
              if (full) setActive(full);
            }}
          />
        </div>
      </section>

      <section className="section" id="about">
        <div className="section__head">
          <p className="section__kicker">About</p>
          <h2 className="section__title">Who is on the mic</h2>
        </div>
        <div className="about-grid">
          <div>
            {bitsData.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="about-stamp">
            Chandigarh
            <br />
            Mohali
            <br />
            Club nights
          </div>
        </div>
      </section>

      <section className="section" id="dates">
        <div className="section__head">
          <p className="section__kicker">Live dates</p>
          <h2 className="section__title">Catch him live</h2>
          <p className="section__text">
            A full city-by-city list is not locked yet. For now, tickets go
            through Jimmy’s upcoming shows page.
          </p>
        </div>
        <div className="dates-box">
          <strong>Upcoming shows</strong>
          <p>
            Check the live ticket page for the latest rooms and festival dates.
          </p>
          <div className="dates-row">
            <span>All current dates →</span>
            <a
              className="btn btn--lemon"
              href={bitsData.ticketsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get tickets
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="book">
        <div className="section__head">
          <p className="section__kicker">Booking</p>
          <h2 className="section__title">Book Jimmy</h2>
          <p className="section__text">
            Colleges, corporates, private shows, and club lineups. Fill this in
            and we open a message draft plus his booking contact on Instagram.
          </p>
        </div>
        <div className="booking">
          <p className="form-note">
            Booking contact from Instagram:{" "}
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
                City
                <input name="city" required placeholder="City" />
              </label>
              <label>
                Preferred date
                <input name="date" type="date" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Venue type
                <select name="venue" defaultValue="College fest">
                  <option>College fest</option>
                  <option>Corporate</option>
                  <option>Private show</option>
                  <option>Club / comedy room</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Budget note
                <input name="budget" placeholder="Rough range (optional)" />
              </label>
            </div>
            <label>
              Message
              <textarea
                name="message"
                placeholder="Tell us about the event"
                required
              />
            </label>
            <button className="btn btn--hot" type="submit">
              Send enquire
            </button>
          </form>
          {formSent ? (
            <p className="form-success">
              Enquire draft opened. Send it to the booking contact to finish.
            </p>
          ) : null}
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

      <footer className="site-footer">
        <span>Jimmy Oye · Immersive Showroom</span>
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
              <button
                type="button"
                className="poster-panel__close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
              <p className="poster-panel__kicker">{active.subtitle}</p>
              <h3 className="poster-panel__title">{active.title}</h3>
              <p className="poster-panel__note">{active.note}</p>
              <div className="poster-panel__actions">
                <a
                  className="btn btn--hot"
                  href={active.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on Instagram
                </a>
                <a
                  className="btn btn--lemon"
                  href={bitsData.ticketsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get tickets
                </a>
                <a
                  className="btn btn--ghost"
                  href="#book"
                  onClick={closeModal}
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
