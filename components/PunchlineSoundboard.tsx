"use client";

import React, { useState, useRef } from "react";

type ScriptBit = {
  id: string;
  bitNum: string;
  title: string;
  setup: string;
  punchlineIntro: string;
  punchline: string;
  outro: string;
  annotationTop: string;
  annotationMid: string;
  annotationStamp: string;
  location: string;
  stampMetric: string;
  stampText: string;
};

const SCRIPT_BITS: ScriptBit[] = [
  {
    id: "sleeping-naked",
    bitNum: "01",
    title: "SLEEPING NAKED",
    setup: "When Jimmy got back to the hostel, room 204 in peak summer. 3 guys packed in 1 room. One cooler that only throws warm humidity.",
    punchlineIntro: "PUNCHLINES — come in what?",
    punchline: "“Bhai AC band mat karna room ka... main kapde nahi pehenta!”",
    outro: "There are moments that fuel an entire hour set on tour...",
    annotationTop: "Annotated joke ↗",
    annotationMid: "punched-up wait ↙",
    annotationStamp: "CROWD LAUGHTER DECIBEL ➔",
    location: "Chandigarh Club Basement - 01:14 AM",
    stampMetric: "9.5M",
    stampText: "CROWD ROAR",
  },
  {
    id: "baniya-calculator",
    bitNum: "02",
    title: "BANIYA CALCULATOR",
    setup: "Dinner bill splits with childhood friends from Sector 17. Everyone calculates split food, Baniya friend calculates inflation & ROI.",
    punchlineIntro: "PUNCHLINES — come in what?",
    punchline: "“Baniyas don’t just calculate bills, they calculate friendship depreciating value.”",
    outro: "Pause 2 seconds before 'depreciating' for deadpan impact.",
    annotationTop: "Sector 17 lore ↗",
    annotationMid: "pause for eye-contact ↙",
    annotationStamp: "ROOM LAUGHTER ➔",
    location: "Sector 26 Comedy Attic - 11:42 PM",
    stampMetric: "ROOM",
    stampText: "LAUGHTER",
  },
  {
    id: "hostel-warden",
    bitNum: "03",
    title: "HOSTEL WARDEN",
    setup: "Night curfew strictly 10:00 PM. Gate scaled at 10:05 PM. Warden waiting on plastic chair with register like a Supreme Court magistrate.",
    punchlineIntro: "PUNCHLINES — high court summons:",
    punchline: "“Hostel attendance sheet dekh kar lagta hai CBI ki charge sheet aa gayi ho.”",
    outro: "Mimic warden's half-specs glare directly into spotlight.",
    annotationTop: "Campus curfew ↗",
    annotationMid: "mimic warden glare ↙",
    annotationStamp: "APPLAUSE & CHEERS ➔",
    location: "Mohali Campus Auditorium - 09:20 PM",
    stampMetric: "LIVE",
    stampText: "CHEERS",
  },
  {
    id: "patiala-vibe",
    bitNum: "04",
    title: "PATIALA VIBE",
    setup: "Cruising down Patiala ring road past midnight. Open windows, subwoofers rattling the door panels, zero reason to hurry anywhere in Punjab.",
    punchlineIntro: "PUNCHLINES — Punjabi bass transition:",
    punchline: "“Chandigarh-Mohali ki hawa mein alag level ka attitude and swag ghoomta hai.”",
    outro: "Transition straight into the Punjabi bass DJ drop right after this.",
    annotationTop: "Bass drop cue ↗",
    annotationMid: "club swagger ↙",
    annotationStamp: "100% SWAG ROAR ➔",
    location: "Patiala Open Mic - 08:45 PM",
    stampMetric: "100%",
    stampText: "SWAG ROAR",
  },
];

export default function PunchlineSoundboard() {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const active = SCRIPT_BITS[selectedIdx];

  const handlePrevBit = () => {
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : SCRIPT_BITS.length - 1));
    if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
      if (isPlaying) {
        mediaRef.current.play().catch(() => {});
      }
    }
  };

  const handleNextBit = () => {
    setSelectedIdx((prev) => (prev < SCRIPT_BITS.length - 1 ? prev + 1 : 0));
    if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
      if (isPlaying) {
        mediaRef.current.play().catch(() => {});
      }
    }
  };

  const handlePlayVoiceMemo = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
      setIsPlaying(false);
    } else {
      if (media.ended || media.currentTime >= (media.duration || 7)) {
        media.currentTime = 0;
      }
      media
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio playback interrupted or blocked:", err);
        });
    }
  };

  const handleTimeUpdate = () => {
    const media = mediaRef.current;
    if (!media || !media.duration) return;
    const pct = (media.currentTime / media.duration) * 100;
    setProgress(pct);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="script-clipboard-deck">
      {/* The Physical Black Clipboard */}
      <div className="script-board">
        {/* Metal Bulldog Clip Clamp at top center */}
        <div className="script-metal-clamp" aria-hidden="true">
          <div className="script-clamp-wire" />
          <div className="script-clamp-bar" />
        </div>

        {/* The Yellow Legal Pad Paper */}
        <div className="script-legal-sheet">
          {/* Vertical Red Margin Rule */}
          <div className="sheet-red-margin" aria-hidden="true" />

          {/* Script Content */}
          <div className="sheet-content">
            {/* Setup Section with Bracket on Left Margin */}
            <div className="sheet-block sheet-block--setup">
              <span className="sheet-heading">SETUP:</span>
              <div className="sheet-setup-annotated">
                <div className="sheet-bracket-tag" aria-hidden="true">
                  <span className="bracket-label">Setup &#125;</span>
                  <span className="bracket-arrow">&darr;</span>
                </div>
                <p className="sheet-body-text">{active.setup}</p>
              </div>
            </div>

            {/* Line 1: Punchline cue with top annotation */}
            <div className="sheet-transition-row">
              <span className="sheet-subheading">{active.punchlineIntro}</span>
              <span className="sheet-red-annotation sheet-red-annotation--top">
                {active.annotationTop}
              </span>
            </div>

            {/* Down arrow & punched-up narration note */}
            <div className="sheet-arrow-row" aria-hidden="true">
              <span className="sheet-red-down-arrow">&darr;</span>
              <span className="sheet-red-annotation sheet-red-annotation--mid-right">
                punched-up narration &#8628;
              </span>
            </div>

            {/* Line 2: Second punchline prompt with minor punchline arrow */}
            <div className="sheet-transition-row sheet-transition-row--second">
              <span className="sheet-subheading">PUNCHLINES &mdash; that&#39;s me, the...</span>
              <span className="sheet-red-annotation sheet-red-annotation--mid">
                minor punchline &#8601;
              </span>
            </div>

            {/* Main Punchline Highlighted in Neon Yellow Marker */}
            <div className="sheet-punchline-row">
              <div className="sheet-annotation-side">
                <span className="sheet-red-annotation sheet-red-annotation--side">
                  {active.annotationMid}
                </span>
              </div>

              <div className={`sheet-highlighter-wrapper ${isPlaying ? "is-active" : ""}`}>
                <mark className="sheet-highlighter-mark">
                  {active.punchline}
                </mark>
              </div>
            </div>

            {/* Outro Follow-up line */}
            <p className="sheet-outro-text">{active.outro}</p>

            {/* Bottom Row: Red Decibel Arrow + Heavy Ink Black Stamp */}
            <div className="sheet-bottom-stamp-row">
              <div className="sheet-decibel-arrow">
                <span>{active.annotationStamp}</span>
              </div>

              {/* Bold Black Box Stamp exactly like the image */}
              <div className="sheet-box-stamp" aria-hidden="true">
                <strong className="stamp-metric">{active.stampMetric}</strong>
                <span className="stamp-sub">{active.stampText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Voice Memo Audio Player Bar (Docked across bottom) */}
        <div className="script-memo-player-bar">
          <button
            type="button"
            className={`memo-btn-play ${isPlaying ? "is-playing" : ""}`}
            onClick={handlePlayVoiceMemo}
            aria-label={isPlaying ? "Playing voice memo" : "Play live audio"}
            title="Play Live Audio & Crowd Reaction"
          >
            <span>{isPlaying ? "❚❚" : "▶"}</span>
          </button>

          <div className="memo-track-content">
            <div className="memo-track-header">
              <span className="memo-track-title">{active.location}</span>
              <div className="memo-pager-stepper">
                <button
                  type="button"
                  className="memo-stepper-btn"
                  onClick={handlePrevBit}
                  title="Previous Draft"
                  aria-label="Previous draft"
                >
                  &larr;
                </button>
                <span className="memo-stepper-count">{active.bitNum} / 04</span>
                <button
                  type="button"
                  className="memo-stepper-btn"
                  onClick={handleNextBit}
                  title="Next Draft"
                  aria-label="Next draft"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* Audio Seek Scrubber Line */}
            <div className="memo-scrubber-track" aria-hidden="true">
              <div
                className={`memo-scrubber-fill ${isPlaying ? "is-playing" : ""}`}
                style={{ width: isPlaying ? `${Math.max(4, progress)}%` : "8%" }}
              />
              <div
                className={`memo-scrubber-dot ${isPlaying ? "is-playing" : ""}`}
                style={{ left: isPlaying ? `${Math.max(4, progress)}%` : "8%" }}
              />
            </div>
          </div>
        </div>

        {/* Real Audio Player using public/starting-video-7s.mp4 */}
        <video
          ref={mediaRef}
          src="/starting-video-7s.mp4"
          playsInline
          preload="auto"
          style={{ display: "none" }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>
    </div>
  );
}
