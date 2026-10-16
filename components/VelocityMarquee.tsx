"use client";

import React from "react";

interface VelocityMarqueeProps {
  text?: string;
  repeat?: number;
  direction?: 1 | -1;
  className?: string;
  rows?: number;
}

export default function VelocityMarquee({
  text = "SAME SHIT · DIFFERENT CITIES · HOSTEL TO TOUR · JIMMY OYE STAND-UP · 100+ SHOWS · ",
  repeat = 8,
  direction = 1,
  className = "",
  rows = 5,
}: VelocityMarqueeProps) {
  // Staggered speed variations for stacked rows (calm, steady ambient drift)
  const baseDurations = [152, 180, 134, 172, 143];

  const repeatedText = Array.from({ length: repeat }).fill(text).join("");

  return (
    <div
      className={`velocity-marquee-block ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => {
        // Alternate directions between adjacent rows to create a mesmerizing kinetic tapestry
        const isReverse = direction === 1 ? rowIndex % 2 === 1 : rowIndex % 2 === 0;
        const duration = baseDurations[rowIndex % baseDurations.length];
        const animationName = isReverse ? "marquee-right" : "marquee-left";

        return (
          <div key={rowIndex} className="marquee-row">
            <div
              className="marquee-row__track"
              style={{
                animationName,
                animationDuration: `${duration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            >
              <span className="marquee-row__chunk">{repeatedText}</span>
              <span className="marquee-row__chunk">{repeatedText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
