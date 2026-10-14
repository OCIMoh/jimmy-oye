import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jimmy Oye — Immersive Showroom",
  description:
    "Walk up to the wall. Pull a bit. Feel the room. Jimmy Oye’s signature bits as a living comedy showroom — watch, get tickets, or book a show.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Figtree:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
