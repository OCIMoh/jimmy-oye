"use client";

import React, { useState } from "react";
import { useSound } from "@/components/SoundSystem";

type TourDate = {
  city: string;
  region: "NORTH" | "SOUTH" | "WEST";
  venue: string;
  address: string;
  date: string;
  time: string;
  status: "SOLD OUT" | "FEW SEATS LEFT" | "FILLING FAST" | "TICKETS LIVE" | "ANNOUNCED";
  ticketCode: string;
  seatsLeft: string;
  priceRange: string;
  gate: string;
  daysRemaining: number;
};

const TOUR_DATES: TourDate[] = [
  {
    city: "CHANDIGARH",
    region: "NORTH",
    venue: "Tagore Theatre",
    address: "Sector 18, Chandigarh",
    date: "OCT 20, 2026",
    time: "08:00 PM",
    status: "FILLING FAST",
    ticketCode: "CHD-902",
    seatsLeft: "18 SEATS LEFT",
    priceRange: "₹499 — ₹1,299",
    gate: "GATE 02 • MAIN AUDITORIUM",
    daysRemaining: 4,
  },
  {
    city: "MOHALI",
    region: "NORTH",
    venue: "The Comedy Club",
    address: "Phase 5, Mohali",
    date: "OCT 24, 2026",
    time: "08:30 PM",
    status: "TICKETS LIVE",
    ticketCode: "MHL-418",
    seatsLeft: "SEATS AVAILABLE",
    priceRange: "₹399 — ₹999",
    gate: "GROUND FLOOR • LIVE STAGE",
    daysRemaining: 8,
  },
  {
    city: "DELHI NCR",
    region: "NORTH",
    venue: "Studio XO & Akshara",
    address: "Connaught Place / South Ex",
    date: "NOV 02, 2026",
    time: "07:30 PM",
    status: "FEW SEATS LEFT",
    ticketCode: "DEL-774",
    seatsLeft: "07 SEATS LEFT",
    priceRange: "₹599 — ₹1,499",
    gate: "EAST GATE • BALCONY / ORCHESTRA",
    daysRemaining: 17,
  },
  {
    city: "BENGALURU",
    region: "SOUTH",
    venue: "Chowdiah Memorial Hall",
    address: "Malleshwaram, Bengaluru",
    date: "NOV 15, 2026",
    time: "08:00 PM",
    status: "FILLING FAST",
    ticketCode: "BLR-319",
    seatsLeft: "24 SEATS LEFT",
    priceRange: "₹499 — ₹1,299",
    gate: "GATE A • MAIN VIOLIN HALL",
    daysRemaining: 30,
  },
  {
    city: "MUMBAI",
    region: "WEST",
    venue: "Royal Opera House / Habitat",
    address: "Bandra & Girgaon, Mumbai",
    date: "NOV 28, 2026",
    time: "09:00 PM",
    status: "SOLD OUT",
    ticketCode: "BOM-001",
    seatsLeft: "0 SEATS REMAINING",
    priceRange: "₹699 — ₹1,799",
    gate: "HOUSEFULL • EXTRA SHOW IN WORKS",
    daysRemaining: 43,
  },
  {
    city: "PUNE",
    region: "WEST",
    venue: "Bal Gandharva Rang Mandir",
    address: "JM Road, Shivajinagar, Pune",
    date: "DEC 05, 2026",
    time: "08:00 PM",
    status: "ANNOUNCED",
    ticketCode: "PUN-552",
    seatsLeft: "PRESALE OPENING SOON",
    priceRange: "₹449 — ₹1,199",
    gate: "CENTRAL HALL • ENTRY GATE 01",
    daysRemaining: 50,
  },
];

type FilterType = "ALL" | "NORTH" | "SOUTH_WEST" | "AVAILABLE";

interface ThermalReceiptTourProps {
  ticketsUrl: string;
}

export default function ThermalReceiptTour({ ticketsUrl }: ThermalReceiptTourProps) {
  const { playPaperHover, playPaperTear, playClick } = useSound();
  const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0);
  const [filter, setFilter] = useState<FilterType>("ALL");

  const activeTour = TOUR_DATES[selectedCityIdx];

  const filteredDates = TOUR_DATES.filter((item) => {
    if (filter === "NORTH") return item.region === "NORTH";
    if (filter === "SOUTH_WEST") return item.region === "SOUTH" || item.region === "WEST";
    if (filter === "AVAILABLE") return item.status !== "SOLD OUT";
    return true;
  });

  const handleSelectCity = (idx: number) => {
    setSelectedCityIdx(idx);
    playPaperHover();
  };

  const handleTearTicket = (city: string) => {
    playPaperTear();
    window.open(ticketsUrl, "_blank", "noreferrer");
  };

  return (
    <div className="receipt-tour-wrapper">
      {/* -------------------------------------------------------------
          LEFT COLUMN: STICKY INTERACTIVE POS TICKET DISPENSER
      -------------------------------------------------------------- */}
      <aside className="pos-dispenser-sticky-deck" aria-label="Interactive Ticket Dispenser">
        {/* Machine Housing */}
        <div className="pos-machine-housing">
          <div className="pos-machine-topbar">
            <span className="pos-indicator-dot" aria-hidden="true" />
            <span className="pos-topbar-label">POS TICKET ENGINE // MK-IV</span>
            <span className="pos-baud-rate">9600 BAUD</span>
          </div>

          {/* Dispenser Mouth Opening Slot */}
          <div className="pos-mouth-slot" aria-hidden="true">
            <div className="pos-mouth-slit" />
          </div>

          {/* Emerging Fresh Off-White Thermal Paper Ticket Stub */}
          <div className="pos-emerging-ticket" key={activeTour.city}>
            {/* Top Barcode */}
            <div className="ticket-barcode-wrap" aria-hidden="true">
              <svg className="ticket-barcode-svg" viewBox="0 0 100 22" fill="currentColor">
                <rect x="0" y="0" width="3" height="22" />
                <rect x="5" y="0" width="2" height="22" />
                <rect x="9" y="0" width="4" height="22" />
                <rect x="15" y="0" width="2" height="22" />
                <rect x="19" y="0" width="5" height="22" />
                <rect x="26" y="0" width="2" height="22" />
                <rect x="31" y="0" width="3" height="22" />
                <rect x="36" y="0" width="2" height="22" />
                <rect x="40" y="0" width="5" height="22" />
                <rect x="47" y="0" width="2" height="22" />
                <rect x="51" y="0" width="3" height="22" />
                <rect x="56" y="0" width="5" height="22" />
                <rect x="63" y="0" width="2" height="22" />
                <rect x="67" y="0" width="4" height="22" />
                <rect x="73" y="0" width="3" height="22" />
                <rect x="78" y="0" width="5" height="22" />
                <rect x="85" y="0" width="2" height="22" />
                <rect x="89" y="0" width="4" height="22" />
                <rect x="95" y="0" width="3" height="22" />
              </svg>
              <span className="ticket-code-label">*{activeTour.ticketCode}* // ADMIT ONE</span>
            </div>

            {/* City Title Header */}
            <div className="ticket-city-header">
              <h3 className="ticket-city-title">{activeTour.city}</h3>
              <p className="ticket-venue-line">{activeTour.venue}</p>
              <p className="ticket-date-line">{activeTour.date} &bull; {activeTour.time}</p>
            </div>

            <div className="ticket-dashed-sep" aria-hidden="true">
              - - - - - - - - - - - - - - - - - - - - -
            </div>

            {/* Dynamic Ticket Metadata */}
            <div className="ticket-details-grid">
              <div className="ticket-meta-cell">
                <span className="ticket-meta-k">LOCATION</span>
                <strong className="ticket-meta-v">{activeTour.address}</strong>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-k">TIER PASS</span>
                <strong className="ticket-meta-v">{activeTour.priceRange}</strong>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-k">ACCESS GATE</span>
                <strong className="ticket-meta-v">{activeTour.gate}</strong>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-k">AVAILABILITY</span>
                <strong className={`ticket-meta-v ${activeTour.status === "SOLD OUT" ? "text-sold" : "text-live"}`}>
                  {activeTour.seatsLeft}
                </strong>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="ticket-action-row">
              {activeTour.status === "SOLD OUT" ? (
                <div className="ticket-sold-block">
                  <div className="ticket-sold-badge">★ SOLD OUT ★</div>
                  <a
                    className="ticket-btn-action ticket-btn-action--waitlist"
                    href="#book"
                    onClick={() => playClick()}
                  >
                    REQUEST EXTRA CITY SHOW &rarr;
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  className="ticket-btn-action ticket-btn-action--lime"
                  onClick={() => handleTearTicket(activeTour.city)}
                >
                  <span>TEAR &amp; BOOK SEAT</span>
                  <span className="ticket-btn-arrow">&rarr;</span>
                </button>
              )}
            </div>

            {/* Realistic Sawtooth Perforated Tear Teeth at bottom */}
            <div className="ticket-sawtooth-teeth" aria-hidden="true" />
          </div>
        </div>

        {/* Minimal Tour Stats & Next Stop Radar Card (Fills Dead Space!) */}
        <div className="pos-tour-radar-card">
          <div className="radar-header">
            <span className="radar-title">MINIMAL TOUR STATS</span>
            <span className="radar-badge">LIVE TRACKER</span>
          </div>

          <div className="radar-countdown-grid">
            <div className="radar-metric">
              <span className="radar-label">NEXT STOP IN</span>
              <strong className="radar-value">4 DAYS</strong>
              <span className="radar-sub">&bull; CHANDIGARH SEC 18</span>
            </div>
            <div className="radar-metric">
              <span className="radar-label">CONFIRMED CITIES</span>
              <strong className="radar-value">06</strong>
              <span className="radar-sub">&bull; 18,000+ SEATS</span>
            </div>
          </div>

          {/* Tour Status Footer */}
          <div className="radar-footer-pill">
            <span className="radar-pulse-dot" aria-hidden="true" />
            <span>SAME SHIT. DIFFERENT CITIES. TOUR ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          RIGHT COLUMN: CONTINUOUS WHITE THERMAL RECEIPT ROLL
      -------------------------------------------------------------- */}
      <main className="thermal-roll-paper" aria-label="Jimmy Oye Tour Manifest Schedule">
        {/* Sawtooth Top Edge */}
        <div className="receipt-sawtooth-top" aria-hidden="true" />

        {/* Receipt Header Banner */}
        <header className="roll-header">
          <div className="roll-header__stamp">★ OFFICIAL TOUR DISPATCH ★</div>
          <h3 className="roll-header__title">JIMMY OYE TOUR MANIFEST</h3>
          <p className="roll-header__tagline">SAME SHIT. DIFFERENT CITIES. 2026</p>

          {/* Barcode */}
          <div className="roll-barcode-box" aria-hidden="true">
            <svg className="roll-barcode-svg" viewBox="0 0 160 24" fill="currentColor">
              <rect x="0" y="0" width="3" height="24" />
              <rect x="5" y="0" width="2" height="24" />
              <rect x="9" y="0" width="5" height="24" />
              <rect x="16" y="0" width="3" height="24" />
              <rect x="22" y="0" width="4" height="24" />
              <rect x="29" y="0" width="2" height="24" />
              <rect x="34" y="0" width="6" height="24" />
              <rect x="43" y="0" width="3" height="24" />
              <rect x="49" y="0" width="4" height="24" />
              <rect x="56" y="0" width="2" height="24" />
              <rect x="61" y="0" width="6" height="24" />
              <rect x="70" y="0" width="3" height="24" />
              <rect x="76" y="0" width="5" height="24" />
              <rect x="84" y="0" width="3" height="24" />
              <rect x="90" y="0" width="4" height="24" />
              <rect x="97" y="0" width="3" height="24" />
              <rect x="103" y="0" width="6" height="24" />
              <rect x="112" y="0" width="2" height="24" />
              <rect x="117" y="0" width="5" height="24" />
              <rect x="125" y="0" width="3" height="24" />
              <rect x="131" y="0" width="5" height="24" />
              <rect x="139" y="0" width="2" height="24" />
              <rect x="144" y="0" width="6" height="24" />
              <rect x="153" y="0" width="3" height="24" />
            </svg>
            <span className="roll-barcode-caption">*JO-LIVE-MANIFEST-2026*</span>
          </div>

          {/* Quick Filter Bar */}
          <div className="roll-filter-bar" role="tablist" aria-label="Filter Tour Dates">
            <button
              type="button"
              className={`roll-filter-btn ${filter === "ALL" ? "is-active" : ""}`}
              onClick={() => {
                setFilter("ALL");
                playClick();
              }}
            >
              ALL (06)
            </button>
            <button
              type="button"
              className={`roll-filter-btn ${filter === "NORTH" ? "is-active" : ""}`}
              onClick={() => {
                setFilter("NORTH");
                playClick();
              }}
            >
              NORTH (03)
            </button>
            <button
              type="button"
              className={`roll-filter-btn ${filter === "SOUTH_WEST" ? "is-active" : ""}`}
              onClick={() => {
                setFilter("SOUTH_WEST");
                playClick();
              }}
            >
              SOUTH &amp; WEST (03)
            </button>
            <button
              type="button"
              className={`roll-filter-btn ${filter === "AVAILABLE" ? "is-active" : ""}`}
              onClick={() => {
                setFilter("AVAILABLE");
                playClick();
              }}
            >
              LIVE ONLY
            </button>
          </div>
        </header>

        {/* Perforated City Tour Rows */}
        <div className="roll-ticket-list">
          {filteredDates.map((tour) => {
            const originalIndex = TOUR_DATES.findIndex((t) => t.city === tour.city);
            const isSelected = selectedCityIdx === originalIndex;
            const isSoldOut = tour.status === "SOLD OUT";

            return (
              <div
                key={tour.city}
                className={`roll-ticket-entry ${isSelected ? "is-selected" : ""} ${isSoldOut ? "is-sold-out" : ""}`}
                onMouseEnter={() => handleSelectCity(originalIndex)}
                onClick={() => handleSelectCity(originalIndex)}
              >
                {/* Dotted Scissor Perforation Line */}
                <div className="roll-scissor-line" aria-hidden="true">
                  <span className="scissor-rule" />
                  <span className="scissor-cut-text">&#9986; TEAR HERE</span>
                </div>

                <div className="roll-ticket-main">
                  {/* Left: City & Venue */}
                  <div className="roll-ticket-info">
                    <div className="roll-city-row">
                      <h4 className="roll-city-name">{tour.city}</h4>
                      {isSoldOut ? (
                        <div className="roll-stamp-sold" aria-label="Sold Out">
                          SOLD OUT
                        </div>
                      ) : (
                        <span className={`roll-status-pill roll-status-pill--${tour.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {tour.status}
                        </span>
                      )}
                    </div>
                    <p className="roll-venue-text">{tour.venue} &bull; {tour.address}</p>
                    <span className="roll-date-text">{tour.date} &bull; {tour.time}</span>
                  </div>

                  {/* Right: Action Button */}
                  <div className="roll-ticket-action">
                    {isSoldOut ? (
                      <span className="roll-sold-label">HOUSEFULL</span>
                    ) : (
                      <button
                        type="button"
                        className="roll-btn-tear"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTearTicket(tour.city);
                        }}
                        data-cursor="tear"
                      >
                        <span>TEAR PASS</span>
                        <span className="roll-btn-arrow">&rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Receipt Bottom Summary */}
        <footer className="roll-footer">
          <div className="roll-divider" />
          <div className="roll-footer-stat">
            <span>TOTAL CITIES SCHEDULED:</span>
            <strong>06 TOUR DATES</strong>
          </div>
          <div className="roll-footer-stat">
            <span>PROMOTER ADVISORY:</span>
            <strong>100% UNFILTERED STAND-UP &bull; 18+ MATURE CONTENT</strong>
          </div>
          <div className="roll-footer-auth">
            <span>AUTH-TXN: 948201-LIVE-STANDUP-VERIFIED</span>
            <p>THANK YOU FOR SUPPORTING LIVE COMEDY &bull; SAVE YOUR RECEIPT</p>
          </div>

          {/* Sawtooth Bottom Cut Edge */}
          <div className="receipt-sawtooth-bottom" aria-hidden="true" />
        </footer>

        {/* Bridge Prompt */}
        <div className="roll-bridge-link">
          <a href="#book" onClick={() => playClick()}>
            <span>Don&apos;t see your city on this leg?</span>
            <strong>Request Jimmy for your college or auditorium show &rarr;</strong>
          </a>
        </div>
      </main>
    </div>
  );
}
