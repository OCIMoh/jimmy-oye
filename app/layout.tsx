import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jimmy Oye — Same Shit. Different People. | Living Comedy Showroom",
  description:
    "Walk up to the wall. Pull a bit. Feel the room. Jimmy Oye’s signature stand-up comedy bits as an interactive living showroom — watch, get tickets, or book a show.",
  keywords: [
    "Jimmy Oye",
    "Stand-up Comedy",
    "Indian Comedy",
    "Chandigarh",
    "Mohali",
    "Bit Poster Wall",
    "Comedy Tour Dates",
    "Book Comedian",
  ],
  authors: [{ name: "Jimmy Oye" }],
  openGraph: {
    title: "Jimmy Oye — Same Shit. Different People.",
    description:
      "Walk up to the wall. Pull a bit. Feel the room. Jimmy Oye's signature comedy bits as an interactive showroom.",
    siteName: "Jimmy Oye Comedy Showroom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jimmy Oye — Same Shit. Different People.",
    description: "Walk up to the wall. Pull a bit. Feel the room.",
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
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Figtree:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
