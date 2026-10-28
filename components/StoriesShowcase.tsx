"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import storiesData from "@/data/stories.json";
import { useSound } from "@/components/SoundSystem";

gsap.registerPlugin(ScrollTrigger);

type StoryVideo = {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  duration?: string | null;
  views?: string | null;
};

// Rich gig metadata for the 4 YouTube sets
const SET_METADATA = [
  {
    city: "Chandigarh",
    cityCode: "CHD",
    venue: "Tagore Theatre",
    duration: "12:14",
    views: "4.2M",
    quote: "“Baniya dost ko daaru pilao, aadhe ghante baad balance sheet khol ke baith jata hai.”",
    hook: "Curfews, warden negotiations & 3 AM Maggi calculations",
  },
  {
    city: "Bengaluru",
    cityCode: "BLR",
    venue: "Chowdiah Hall",
    duration: "16:30",
    views: "2.8M",
    quote: "“Bangalore mein auto waala meter se nahi, tumhari majboori dekh ke rate bolta hai.”",
    hook: "Silk Board traffic & auto drivers charging on desperation",
  },
  {
    city: "Chandigarh",
    cityCode: "CHD",
    venue: "The Comedy Club",
    duration: "11:05",
    views: "1.9M",
    quote: "“Front row mein couple baitha tha, maine bas pucha 'Kab se?'... dono ka chehra utar gaya.”",
    hook: "Crowd work. The front-row couple that regretted eye contact",
  },
  {
    city: "Mumbai",
    cityCode: "MUM",
    venue: "Studio XO",
    duration: "22:45",
    views: "3.5M",
    quote: "“Gaurav bolta hai main exaggerate karta hoon... bhai tu khud 25 minute se cheekh raha hai!”",
    hook: "Two Punjabis talking at maximum volume for 25 minutes",
  },
];

export default function StoriesShowcase() {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { playClick, playWhoosh, playMicClick, playPaperHover } = useSound();

  const videos = storiesData.videos as StoryVideo[];
  const featured = videos[featuredIdx];
  const meta = SET_METADATA[featuredIdx % SET_METADATA.length];

  // GSAP staggered reveal on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.from(".stories-featured-wrap", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
      gsap.from(".stories-card", {
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSelectVideo = (idx: number) => {
    if (idx === featuredIdx && isPlaying) return;
    playMicClick();
    setFeaturedIdx(idx);
    setIsPlaying(true);
  };

  const handlePlay = () => {
    playWhoosh();
    setIsPlaying(true);
  };

  return (
    <section className="manifesto-section manifesto-section--stories" id="stories" ref={sectionRef}>
      {/* Background Atmosphere */}
      <div className="stories-spotlight-beam" aria-hidden="true" />

      {/* Section Header */}
      <div className="stories-header">
        <span className="manifesto-tag">RECORDED SETS</span>
        <h2 className="manifesto-heading stories-heading">PAST SETS.</h2>
        <p className="manifesto-lead">
          The YouTube material that paid the rent. If you’ve already seen these, good — the 2026 tour is all new jokes.
        </p>
      </div>

      <div className="stories-stage">
        {/* ============================================================== */}
        {/* LEFT: Master Stage Screen                                      */}
        {/* ============================================================== */}
        <div className="stories-featured-wrap">
          <div className="stories-crt-frame">
            {/* Top Broadcast Monitor Bar */}
            <div className="stories-screen-topbar" aria-hidden="true">
              <span className="stories-screen-venue">
                RECORDED LIVE • {meta.venue.toUpperCase()}, {meta.city.toUpperCase()}
              </span>
              <span className="stories-screen-duration">
                {meta.duration} • UNCUT
              </span>
            </div>

            {/* CRT Scanline overlay */}
            <div className="stories-scanlines" aria-hidden="true" />

            {/* VHS Tracking Bar */}
            <div className="stories-vhs-tracking" aria-hidden="true" />

            {/* Gaffer tape accents */}
            <div className="stories-tape stories-tape--tl" aria-hidden="true" />
            <div className="stories-tape stories-tape--br" aria-hidden="true" />

            {/* Corner Crop Marks */}
            <span className="stories-crosshair stories-crosshair--tl" aria-hidden="true" />
            <span className="stories-crosshair stories-crosshair--tr" aria-hidden="true" />
            <span className="stories-crosshair stories-crosshair--bl" aria-hidden="true" />
            <span className="stories-crosshair stories-crosshair--br" aria-hidden="true" />

            <AnimatePresence mode="wait">
              {isPlaying ? (
                /* --- Active Video Playback --- */
                <motion.div
                  key={`playing-${featured.id}`}
                  className="stories-iframe-wrap"
                  data-cursor="hidden"
                  onMouseEnter={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("custom-cursor", { detail: { mode: "hidden" } })
                      );
                    }
                  }}
                  onMouseLeave={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("custom-cursor", { detail: { mode: "default" } })
                      );
                    }
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube-nocookie.com/embed/${featured.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={featured.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="stories-iframe"
                  />
                </motion.div>
              ) : (
                /* --- Standby Thumbnail State --- */
                <motion.div
                  key={`thumb-${featured.id}`}
                  className="stories-thumbnail-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handlePlay}
                  data-cursor="view"
                >
                  <img
                    src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`}
                    alt={featured.title}
                    className="stories-thumb-img"
                    loading="lazy"
                  />

                  {/* Static noise overlay */}
                  <div className="stories-static-noise" aria-hidden="true" />

                  {/* Stage Lighting Vignette */}
                  <div className="stories-thumb-vignette" aria-hidden="true" />

                  {/* Center Play Button */}
                  <motion.button
                    className="stories-play-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay();
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={`Play ${featured.title}`}
                    data-cursor="view"
                  >
                    <span className="stories-play-icon">▶</span>
                    <span className="stories-play-label">PLAY BIT</span>
                  </motion.button>

                  {/* Standby Lower-Third Info */}
                  <div className="stories-lower-third">
                    <span className="stories-lower-third-idx">0{featuredIdx + 1} / 04</span>
                    <h3 className="stories-lower-third-title">{featured.title}</h3>
                    <p className="stories-lower-third-quote">{meta.quote}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Under-Screen Punchline & Tour Bridge */}
          <div className="stories-bridge-bar">
            <div className="stories-bridge-quote">
              <span className="stories-quote-text">{meta.quote}</span>
            </div>

            <a href="#dates" className="stories-bridge-btn" data-cursor="view">
              <span>2026 TOUR TICKETS (ALL NEW BITS)</span>
              <span className="stories-bridge-arrow">→</span>
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: Enhanced Playlist Sidebar                               */}
        {/* ============================================================== */}
        <div className="stories-playlist">
          {/* Sidebar Header */}
          <div className="stories-playlist-header">
            <div className="playlist-header-left">
              <span className="stories-playlist-label">UP NEXT</span>
              <span className="stories-playlist-sub">ROAD-TESTED SETS</span>
            </div>
            <span className="stories-playlist-count">4 RECORDED</span>
          </div>

          {/* Playlist Cards List */}
          <div className="stories-playlist-list">
            {videos.map((video, idx) => {
              const videoMeta = SET_METADATA[idx % SET_METADATA.length];
              const isActive = idx === featuredIdx;

              return (
                <motion.button
                  key={video.id}
                  type="button"
                  className={`stories-card ${isActive ? "stories-card--active" : ""}`}
                  onClick={() => handleSelectVideo(idx)}
                  onMouseEnter={() => {
                    setHoveredIdx(idx);
                    playPaperHover();
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  data-cursor="view"
                >
                  {/* Left: Thumbnail & Badges */}
                  <div className="stories-card-thumb-wrap">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="stories-card-thumb"
                      loading="lazy"
                    />

                    {/* Mini static noise */}
                    <div className="stories-card-static" aria-hidden="true" />

                    {/* City Code Tag */}
                    <span className="stories-card-city-pill">{videoMeta.cityCode}</span>

                    {/* Duration Badge */}
                    <span className="stories-card-duration">{videoMeta.duration}</span>

                    {/* Playing Equalizer Overlay */}
                    {isActive && isPlaying && (
                      <div className="stories-card-eq-overlay">
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                        <div className="eq-bar" />
                      </div>
                    )}
                  </div>

                  {/* Center: Title & Hook */}
                  <div className="stories-card-info">
                    <div className="stories-card-title-row">
                      <span className="stories-card-title">{video.title}</span>
                    </div>

                    <p className="stories-card-hook">{videoMeta.hook}</p>

                    <div className="stories-card-meta-bottom">
                      <span className="stories-card-venue">{videoMeta.city}</span>
                      <span className="stories-card-dot">•</span>
                      <span className="stories-card-views">{videoMeta.views} views</span>
                      <span className="stories-card-dot">•</span>
                      <span className={`stories-card-action ${isActive ? "stories-card-action--active" : ""}`}>
                        {isActive && isPlaying ? "PLAYING" : isActive ? "ON SCREEN" : "SELECT →"}
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator Left Glow Bar */}
                  {isActive && <div className="stories-card-active-bar" />}
                </motion.button>
              );
            })}
          </div>

          {/* YouTube Channel CTA Footer */}
          <a
            className="stories-yt-cta"
            href={`https://youtube.com/${storiesData.youtubeChannel}`}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
          >
            <span>VIEW COMPLETE VAULT ON YOUTUBE ({storiesData.youtubeChannel})</span>
            <span className="stories-yt-cta-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
