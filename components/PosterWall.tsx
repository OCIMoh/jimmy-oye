"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import bitsData from "@/data/bits.json";

type Bit = (typeof bitsData.bits)[number];

export default function PosterWall() {
  const [active, setActive] = useState<Bit | null>(null);
  const [formSent, setFormSent] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const cards = wall.querySelectorAll(".poster");
    gsap.fromTo(
      cards,
      { y: 36, opacity: 0, rotate: -2 },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (active) {
      document.body.classList.add("modal-open");
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { pointerEvents: "auto", opacity: 0 });
      gsap.to(overlay, { opacity: 1, duration: 0.28, ease: "power2.out" });

      const panel = panelRef.current;
      if (panel) {
        gsap.killTweensOf(panel);
        gsap.fromTo(
          panel,
          { y: 48, scale: 0.92, rotate: -1.2, opacity: 0 },
          {
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.42,
            ease: "back.out(1.4)",
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

  return (
    <>
      <nav className="site-nav">
        <a className="site-nav__brand" href="#top">
          Jimmy Oye
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

      <header className="hero" id="top">
        <div className="hero__stage" aria-hidden="true" />
        <div className="hero__noise" aria-hidden="true" />
        <div className="hero__content">
          <span className="hero__eyebrow">Bit Poster Wall · Preview</span>
          <h1 className="hero__title">Jimmy Oye</h1>
          <p className="hero__line">{bitsData.tagline}</p>
          <div className="hero__actions">
            <a className="btn btn--lemon" href="#bits">
              See the bits
            </a>
            <a
              className="btn btn--hot"
              href={bitsData.ticketsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get tickets
            </a>
          </div>
        </div>
        <a className="hero__scroll" href="#bits" aria-label="Scroll to poster wall">
          <span />
          Scroll the wall
        </a>
      </header>

      <section className="section" id="bits">
        <div className="section__head">
          <p className="section__kicker">The wall</p>
          <h2 className="section__title">Six posters. Six bits.</h2>
          <p className="section__text">
            Tap a poster to open the bit, then jump to tickets or booking.
            This is a tight edit of Jimmy’s strongest stage moments — not his
            whole Instagram feed.
          </p>
        </div>
        <div className="poster-wall" ref={wallRef}>
          {bitsData.bits.map((bit) => (
            <button
              key={bit.id}
              type="button"
              className="poster"
              style={{ ["--poster-accent" as string]: bit.accent }}
              onClick={() => setActive(bit)}
              onPointerDown={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 0.97,
                  duration: 0.12,
                  ease: "power2.out",
                });
              }}
              onPointerUp={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.18,
                  ease: "power2.out",
                });
              }}
              onPointerLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.18,
                  ease: "power2.out",
                });
              }}
              aria-label={`Open poster for ${bit.title}`}
            >
              <span className="poster__pin" aria-hidden="true" />
              <span className="poster__band">Jimmy Oye · Bit Poster</span>
              <span className="poster__photo">
                <img
                  className="poster__img"
                  src={`${bit.cover}?v=4`}
                  alt=""
                />
              </span>
              <span className="poster__meta">
                <span className="poster__bit-label">{bit.subtitle}</span>
                <span className="poster__bit-title">{bit.title}</span>
              </span>
              <span className="poster__glow" aria-hidden="true" />
              <span className="poster__hint">Open</span>
            </button>
          ))}
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
        <span>Jimmy Oye · Bit Poster Wall preview</span>
        <a href={bitsData.instagram} target="_blank" rel="noreferrer">
          @jimmy_oye
        </a>
      </footer>

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
            <a
              className="poster-panel__media"
              href={active.instagramUrl}
              target="_blank"
              rel="noreferrer"
              style={{ ["--poster-accent" as string]: active.accent }}
            >
              <span className="poster-panel__band">Jimmy Oye · Bit Poster</span>
              <img src={`${active.cover}?v=4`} alt="" />
              <span className="poster-panel__play" aria-hidden="true">
                ▶
              </span>
              <span className="poster-panel__watch-label">Watch this reel</span>
            </a>
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
