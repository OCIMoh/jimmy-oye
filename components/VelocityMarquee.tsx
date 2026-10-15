"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VelocityMarqueeProps {
  text?: string;
  repeat?: number;
  direction?: 1 | -1;
  className?: string;
}

export default function VelocityMarquee({
  text = "SAME SHIT · DIFFERENT PEOPLE · STAND-UP COMEDY · LIVE TOUR · JIMMY OYE · ",
  repeat = 4,
  direction = 1,
  className = "",
}: VelocityMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let xPos = 0;
    let baseSpeed = 1.2 * direction;
    let velocityMultiplier = 1;
    let rafId: number;

    const items = track.children;
    const singleWidth = track.scrollWidth / 2;

    const loop = () => {
      xPos -= baseSpeed * velocityMultiplier;

      // Wrap around seamlessly
      if (direction === 1) {
        if (xPos <= -singleWidth) {
          xPos += singleWidth;
        }
      } else {
        if (xPos >= 0) {
          xPos -= singleWidth;
        }
      }

      gsap.set(track, { x: xPos });

      // Decay velocity multiplier back toward 1
      velocityMultiplier += (1 - velocityMultiplier) * 0.08;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Track scroll velocity via ScrollTrigger
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity());
        if (vel > 50) {
          // Accelerate proportionally with scroll velocity
          const boost = Math.min(vel / 280, 5);
          velocityMultiplier = 1 + boost;
        }
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, [direction]);

  const repeatedText = Array.from({ length: repeat }).fill(text).join("");

  return (
    <div className={`velocity-marquee ${className}`} ref={containerRef} aria-hidden="true">
      <div className="velocity-marquee__track" ref={trackRef}>
        <span className="velocity-marquee__chunk">{repeatedText}</span>
        <span className="velocity-marquee__chunk">{repeatedText}</span>
      </div>
    </div>
  );
}
