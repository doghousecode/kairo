import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kairo",
  description: "Your AI chief of staff.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kairo",
  },
};

const SPLASH_DURATION = 4.8; // seconds total
const PAGE_REVEAL_START = 4.2; // seconds — slightly before splash fully gone

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0d0d0d" />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes kairoSplashAnim {
            0%   { opacity: 0; }
            12%  { opacity: 1; }
            75%  { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes pageRevealAnim {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          #kairo-splash {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #0d0d0d;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2.5vw;
            pointer-events: none;
            animation: kairoSplashAnim ${SPLASH_DURATION}s ease forwards;
          }
          #kairo-root {
            animation: pageRevealAnim 0.6s ease ${PAGE_REVEAL_START}s both;
          }
        `}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Splash — server-rendered so it's in the first paint, zero flicker */}
        <div id="kairo-splash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt=""
            style={{ width: '52vw', maxWidth: '500px', height: 'auto' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kairo-wordmark-cropped.png"
            alt="Kairo"
            style={{ width: '36vw', maxWidth: '360px', height: 'auto' }}
          />
        </div>

        <div id="kairo-root">
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
          document.getElementById('kairo-splash').addEventListener('animationend', function() {
            this.remove();
          });
        `}} />
      </body>
    </html>
  );
}
