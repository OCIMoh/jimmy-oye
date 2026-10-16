"use client";

import React, { useState } from "react";
import { useSound } from "@/components/SoundSystem";

interface BookingDispatchProps {
  instagramUrl: string;
}

export default function BookingDispatch({ instagramUrl }: BookingDispatchProps) {
  const [formSent, setFormSent] = useState(false);
  const { playClick, playWhoosh } = useSound();

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playWhoosh();
    const form = e.currentTarget;
    const data = new FormData(form);
    const lines = [
      "Jimmy Oye Booking Enquiry (Raw Setlist Manifesto)",
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Event location: ${data.get("city") || ""}`,
      `Event type: ${data.get("venue") || ""}`,
      `Details: ${data.get("message") || ""}`,
    ];
    const body = encodeURIComponent(lines.join("\n"));
    const subject = encodeURIComponent("Book Jimmy Oye — Live Show Enquiry");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  return (
    <section className="manifesto-section manifesto-section--book" id="book">
      <div className="manifesto-booking-wrap">
        <div className="manifesto-booking-copy">
          <span className="manifesto-tag">BOOKING DISPATCH</span>
          <h2 className="manifesto-heading">BRING JIMMY TO YOUR STAGE.</h2>
          <p className="manifesto-lead">
            College cultural festivals, corporate annual galas, private rooms, and auditorium shows. Tell us about your night.
          </p>

          <div className="manifesto-booking-channels">
            <a
              className="booking-channel booking-channel--wa"
              href="https://wa.me/919876543210?text=Hi%20Jimmy%20Oye%20Team%2C%20inquiry%20for%20live%20stand-up%20show"
              target="_blank"
              rel="noreferrer"
              data-cursor="click"
              onClick={() => playClick()}
            >
              <span className="booking-channel__icon">💬</span>
              <div>
                <strong>WhatsApp Concierge</strong>
                <span>Direct artist liaison &bull; Instant quote</span>
              </div>
            </a>

            <a
              className="booking-channel booking-channel--ig"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="click"
              onClick={() => playClick()}
            >
              <span className="booking-channel__icon">📸</span>
              <div>
                <strong>Instagram DM</strong>
                <span>@jimmyoye &bull; Verified dispatch</span>
              </div>
            </a>
          </div>
        </div>

        <form className="manifesto-booking-form" onSubmit={handleBooking}>
          <div className="booking-form-grid">
            <div className="booking-field">
              <label htmlFor="bk-name">ORGANIZER / NAME</label>
              <input
                type="text"
                id="bk-name"
                name="name"
                required
                placeholder="e.g. Kabir Sehgal"
              />
            </div>

            <div className="booking-field">
              <label htmlFor="bk-email">EMAIL ADDRESS</label>
              <input
                type="email"
                id="bk-email"
                name="email"
                required
                placeholder="kabir@events.com"
              />
            </div>

            <div className="booking-field">
              <label htmlFor="bk-city">CITY / DESTINATION</label>
              <input
                type="text"
                id="bk-city"
                name="city"
                required
                placeholder="e.g. Chandigarh / Delhi / Bangalore"
              />
            </div>

            <div className="booking-field">
              <label htmlFor="bk-venue">EVENT TYPE</label>
              <select id="bk-venue" name="venue" defaultValue="college">
                <option value="college">College Cultural Fest (Headliner)</option>
                <option value="club">Comedy Club / Auditorium</option>
                <option value="corporate">Corporate Annual Dinner / Offsite</option>
                <option value="dj-comedy">Hybrid DJ Set + Standup Routine</option>
                <option value="private">Private / Curated Room</option>
              </select>
            </div>

            <div className="booking-field booking-field--full">
              <label htmlFor="bk-msg">ESTIMATED CROWD &amp; DETAILS</label>
              <textarea
                id="bk-msg"
                name="message"
                rows={3}
                required
                placeholder="Audience size, stage setup, desired set duration, dates..."
              />
            </div>
          </div>

          <div className="booking-form-actions">
            <button
              type="submit"
              className="manifesto-btn manifesto-btn--lime manifesto-btn--submit"
              data-cursor="click"
            >
              DISPATCH ENQUIRY →
            </button>
            {formSent && (
              <span className="booking-form-status">
                ✓ Opening mail client to dispatch...
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
