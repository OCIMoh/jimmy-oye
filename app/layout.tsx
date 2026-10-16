import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jimmy Oye — Same Shit. Different People. | The Raw Setlist Manifesto",
  description:
    "Jimmy Oye's live stand-up comedy special & bit archive — 21 uncensored routines, live tour dates, and booking dispatch.",
  keywords: [
    "Jimmy Oye",
    "Stand-up Comedy",
    "Indian Comedy",
    "Same Shit Different People",
    "Chandigarh",
    "Mohali",
    "Comedy Tour Dates",
    "Book Comedian",
  ],
  authors: [{ name: "Jimmy Oye" }],
  openGraph: {
    title: "Jimmy Oye — Same Shit. Different People. | The Raw Setlist Manifesto",
    description:
      "Jimmy Oye's signature stand-up routines, live tour dates, and booking dispatch.",
    siteName: "Jimmy Oye Comedy Showcase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jimmy Oye — Same Shit. Different People.",
    description: "21 live comedy routines, tour dates, and booking dispatch.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@600;700&family=Figtree:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
