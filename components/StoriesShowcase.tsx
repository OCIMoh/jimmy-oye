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

export default function StoriesShowcase() {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { playClick, playWhoosh } = useSound();

  const videos = storiesData.videos as StoryVideo[];
  const featured = videos[featuredIdx];

  // GSAP staggered reveal on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.from(".stories-card", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
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
    });
    return () => ctx.revert();
  }, []);

  const handleSelectVideo = (idx: number) => {
    if (idx === featuredIdx && isPlaying) return;
    playWhoosh();
    setIsPlaying(false);
    setFeaturedIdx(idx);
  };

  const handlePlay = () => {
    playClick();
    setIsPlaying(true);
  };

  return (
    <section className="manifesto-section manifesto-section--stories" id="stories" ref={sectionRef}>
      {/* Section Header */}
      <div className="stories-header">
        <span className="manifesto-tag">JIMMY OYE × YOUTUBE</span>
        <h2 className="manifesto-heading stories-heading">WATCH THE SET.</h2>
        <p className="manifesto-lead">
          Full bits, crowd work, and guest spots — the complete Jimmy Oye experience, right here.
        </p>
      </div>

      <div className="stories-stage">
        {/* LEFT: Featured Video (Big CRT Screen) */}
        <div className="stories-featured-wrap">
          <div className="stories-crt-frame">
            {/* CRT Scanline overlay */}
            <div className="stories-scanlines" aria-hidden="true" />

            {/* VHS Tracking Bar */}
            <div className="stories-vhs-tracking" aria-hidden="true" />

            {/* Gaffer tape accents */}
            <div className="stories-tape stories-tape--tl" aria-hidden="true" />
            <div className="stories-tape stories-tape--br" aria-hidden="true" />

            <AnimatePresence mode="wait">
              {isPlaying ? (
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
                <motion.div
                  key={`thumb-${featured.id}`}
                  className="stories-thumbnail-wrap"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* YouTube maxres thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`}
                    alt={featured.title}
                    className="stories-thumb-img"
                    loading="lazy"
                  />

                  {/* Static noise overlay */}
                  <div className="stories-static-noise" aria-hidden="true" />

                  {/* Play button */}
                  <motion.button
                    className="stories-play-btn"
                    onClick={handlePlay}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={`Play ${featured.title}`}
                    data-cursor="view"
                  >
                    <span className="stories-play-icon">▶</span>
                  </motion.button>

                  {/* Duration badge */}
                  {featured.duration && (
                    <span className="stories-duration-badge">{featured.duration}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Featured Video Info */}
          <div className="stories-featured-info">
            <div className="stories-featured-meta">
              {featured.views && (
                <span className="stories-views-badge">▶ {featured.views} views</span>
              )}
              <span className="stories-subtitle-badge">{featured.subtitle}</span>
            </div>
            <h3 className="stories-featured-title">{featured.title}</h3>
          </div>
        </div>

        {/* RIGHT: Playlist Sidebar */}
        <div className="stories-playlist">
          <div className="stories-playlist-header">
            <span className="stories-playlist-label">UP NEXT</span>
            <span className="stories-playlist-count">
              {videos.length} VIDEOS
            </span>
          </div>
          <div className="stories-playlist-list">
            {videos.map((video, idx) => (
              <motion.button
                key={video.id}
                type="button"
                className={`stories-card ${idx === featuredIdx ? "stories-card--active" : ""}`}
                onClick={() => handleSelectVideo(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                data-cursor="view"
              >
                {/* Mini thumbnail */}
                <div className="stories-card-thumb-wrap">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="stories-card-thumb"
                    loading="lazy"
                  />
                  {/* Mini static */}
                  <div
                    className={`stories-card-static ${hoveredIdx === idx ? "stories-card-static--clear" : ""}`}
                    aria-hidden="true"
                  />
                  {video.duration && (
                    <span className="stories-card-duration">{video.duration}</span>
                  )}
                  {idx === featuredIdx && isPlaying && (
                    <span className="stories-card-playing-pill">● NOW PLAYING</span>
                  )}
                </div>

                {/* Card info */}
                <div className="stories-card-info">
                  <span className="stories-card-title">{video.title}</span>
                  <span className="stories-card-sub">{video.subtitle}</span>
                  {video.views && (
                    <span className="stories-card-views">{video.views} views</span>
                  )}
                </div>

                {/* Active indicator */}
                {idx === featuredIdx && (
                  <div className="stories-card-active-bar" />
                )}
              </motion.button>
            ))}
          </div>

          {/* YouTube Channel CTA */}
          <a
            className="stories-yt-cta"
            href={`https://youtube.com/${storiesData.youtubeChannel}`}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
          >
            <span className="stories-yt-cta-icon">▶</span>
            <span>VIEW ALL ON YOUTUBE</span>
            <span className="stories-yt-cta-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
