"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import { useSound } from "@/components/SoundSystem";

type SetlistItem = {
  id: string;
  num: string;
  title: string;
  note?: string;
  isHit?: boolean;
};

const SETLIST_ITEMS: SetlistItem[] = [
  { id: "sleeping-naked", num: "01", title: "Sleeping Naked", note: "9.5M VIEWS · VIRAL", isHit: true },
  { id: "arts-students", num: "02", title: "Arts Students vs Engineers", note: "Hostel crowd" },
  { id: "baniyas-are-intelligent", num: "03", title: "Baniya Math & Calculator Mindset", note: "Crowd favorite" },
  { id: "panjabis-english", num: "04", title: "Panjabis & English Chaos", note: "Language bit" },
  { id: "girls-vs-boys", num: "05", title: "Girls vs Boys Logic", isHit: true },
  { id: "unhealthy-trend", num: "06", title: "The Health Trend Paradox", note: "Sharp timing" },
  { id: "bakri-ka-doodh", num: "07", title: "Bakri Ka Doodh", note: "Classic story" },
  { id: "bangalore-diaries", num: "08", title: "Bangalore Tech & Traffic", note: "Tour closer" },
];

interface DraggableSetlistProps {
  onSelectBit: (bitId: string) => void;
}

export default function DraggableSetlist({ onSelectBit }: DraggableSetlistProps) {
  const { playPaperHover, playTapeRip, playClick } = useSound();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playClick();
    onSelectBit(id);
  };

  return (
    <div className="setlist-wrapper" ref={constraintsRef}>
      <motion.div
        className="setlist-card"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        whileDrag={{ scale: 1.04, rotate: -3, cursor: "grabbing" }}
        onDragStart={() => playTapeRip()}
        onPointerEnter={() => playPaperHover()}
        data-cursor="drag"
        initial={{ opacity: 0, y: 32, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Duct Tape corner anchors */}
        <span className="setlist-card__tape setlist-card__tape--top-left" aria-hidden="true" />
        <span className="setlist-card__tape setlist-card__tape--top-right" aria-hidden="true" />

        {/* Header / Notepad Margin */}
        <div className="setlist-card__header">
          <div className="setlist-card__spiral" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="setlist-card__hole" />
            ))}
          </div>
          <div className="setlist-card__title-row">
            <span className="setlist-card__label">STAGE SETLIST</span>
            <span className="setlist-card__meta">HOTEL ROOM 402 · 18:30</span>
          </div>
          <p className="setlist-card__subtitle">Jimmy Oye · Live Tour Set</p>
        </div>

        {/* Lined paper handwritten list */}
        <ol className="setlist-card__list">
          {SETLIST_ITEMS.map((item) => (
            <li
              key={item.id}
              className={`setlist-card__item${item.isHit ? " setlist-card__item--hit" : ""}`}
              onClick={(e) => handleItemClick(e, item.id)}
              data-cursor="view"
            >
              <span className="setlist-card__item-num">{item.num}.</span>
              <span className="setlist-card__item-text">{item.title}</span>
              {item.note ? (
                <span className="setlist-card__item-badge">{item.note}</span>
              ) : null}
            </li>
          ))}
        </ol>

        {/* Footer scribbles */}
        <div className="setlist-card__footer">
          <span className="setlist-card__scribble">★ END ON DJ SET ★</span>
          <span className="setlist-card__hint">DRAG ANYWHERE · TAP BIT TO JUMP</span>
        </div>
      </motion.div>
    </div>
  );
}
