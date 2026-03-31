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

const SPLASH_DURATION = 4.8;   // seconds — hold then fade out
const PAGE_REVEAL    = 0.6;    // seconds — page fade-in duration

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: '#0d0d0d' }}>
      <head>
        <meta name="theme-color" content="#0d0d0d" />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes kairoSplashAnim {
            0%   { opacity: 1; }
            80%  { opacity: 1; }
            100% { opacity: 0; }
          }
          #kairo-splash {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: #0d0d0d;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            animation: kairoSplashAnim ${SPLASH_DURATION}s ease forwards;
          }
        `}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ background: '#0d0d0d' }}>

        {/* Splash — server-rendered, first paint, covers everything below */}
        <div id="kairo-splash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kairo-wordmark-cropped.png"
            alt="Kairo"
            style={{ width: '68vw', maxWidth: '680px', height: 'auto' }}
          />
        </div>

        {/* opacity:0 inline so it's hidden before any CSS or JS parses */}
        <div id="kairo-root" style={{ opacity: 0 }}>
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var splash = document.getElementById('kairo-splash');
            var root   = document.getElementById('kairo-root');
            if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
            splash.addEventListener('animationend', function() {
              splash.remove();
              root.style.transition = 'opacity ${PAGE_REVEAL}s ease';
              root.style.opacity    = '1';
            });
          })();
        `}} />
      </body>
    </html>
  );
}
