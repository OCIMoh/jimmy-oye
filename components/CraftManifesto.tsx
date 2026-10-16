"use client";

import React from "react";
import PunchlineSoundboard from "@/components/PunchlineSoundboard";

interface CraftManifestoProps {
  instagramUrl: string;
}

export default function CraftManifesto({ instagramUrl }: CraftManifestoProps) {
  return (
    <section className="manifesto-section manifesto-section--story" id="story">
      <div className="manifesto-story-wrap">
        <div className="manifesto-story-left">
          <span className="manifesto-tag manifesto-tag--craft">JIMMY OYE</span>

          {/* Zine Punk Cutout Ransom Title */}
          <div className="ransom-title" role="heading" aria-level={2} aria-label="HOW A JOKE GETS BORN">
            <div className="ransom-line">
              <span className="ransom-word">
                <span className="ransom-char char-tilt-1">H</span>
                <span className="ransom-char char-tilt-2">O</span>
                <span className="ransom-char char-tilt-3">W</span>
              </span>
              <span className="ransom-word">
                <span className="ransom-char char-tilt-4">A</span>
              </span>
              <span className="ransom-word">
                <span className="ransom-char char-tilt-5">J</span>
                <span className="ransom-char char-tilt-6">O</span>
                <span className="ransom-char char-tilt-1">K</span>
                <span className="ransom-char char-tilt-2">E</span>
              </span>
            </div>
            <div className="ransom-line">
              <span className="ransom-word">
                <span className="ransom-char char-tilt-3">G</span>
                <span className="ransom-char char-tilt-4">E</span>
                <span className="ransom-char char-tilt-5">T</span>
                <span className="ransom-char char-tilt-6">S</span>
              </span>
              <span className="ransom-word ransom-word--inverted">
                <span className="ransom-char char-tilt-1">B</span>
                <span className="ransom-char char-tilt-2">O</span>
                <span className="ransom-char char-tilt-3">R</span>
                <span className="ransom-char char-tilt-4">N</span>
              </span>
            </div>
          </div>

          <p className="manifesto-lead">
            A zine punk aesthetic, raw comedy forged in engineering hostel rooms, tested in club basements, and refined through 100+ live crowd interactions.
          </p>

          {/* Taped Engineering Hostel Note Scrap */}
          <div className="hostel-note-scrap">
            <div className="hostel-note-tape hostel-note-tape--tl" aria-hidden="true" />
            <div className="hostel-note-tape hostel-note-tape--tr" aria-hidden="true" />
            <div className="hostel-note-tape hostel-note-tape--bl" aria-hidden="true" />
            <div className="hostel-note-tape hostel-note-tape--br" aria-hidden="true" />

            <div className="hostel-note-header">
              <span className="hostel-note-tag">HOSTEL NOTE SCRAP</span>
            </div>
            <div className="hostel-note-lines">
              <p className="hostel-note-lead-thought">
                Raw crowd instincts and late-night hostel chaos.
              </p>
              <p className="hostel-note-idea">
                <strong>Idea:</strong> BANIYA + ALCOHOL = 💰 + 🍺
              </p>
              <p className="hostel-note-dialogue">
                <em>(Self)</em> “Abbe kya phook ke aaya hai?”
              </p>
              <p className="hostel-note-dialogue">
                <em>(Jimmy)</em> “Nahi, sirf calculations...!”
              </p>
              <span className="hostel-note-sign">— JIMMY OYE</span>
            </div>
          </div>

          {/* Also DJs Sub-Plot Card */}
          <div className="dj-card">
            <div className="dj-card__body">
              <div className="dj-card__topline">
                <strong className="dj-card__title">DJ CLUB SETS</strong>
                <span className="dj-card__live-pill">● LIVE ON TOUR</span>
              </div>
              <p className="dj-card__text">
                When the mic rests, Jimmy spins underground Punjabi bass & club edits. Comedy stays the headline story on this tour.
              </p>
              <a
                className="dj-card__link"
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
              >
                LEARN MORE ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Live Punchline Soundboard */}
        <div className="manifesto-story-right">
          <PunchlineSoundboard />
        </div>
      </div>
    </section>
  );
}
