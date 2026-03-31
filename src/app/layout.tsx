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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: '#0d0d0d' }}>
      <head>
        <meta name="theme-color" content="#0d0d0d" />
        {/* Apple startup images — prevent white flash during PWA launch */}
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-750-1334.png"  media="(device-width:375px) and (device-height:667px) and (-webkit-device-pixel-ratio:2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.png" media="(device-width:375px) and (device-height:812px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-828-1792.png"  media="(device-width:414px) and (device-height:896px) and (-webkit-device-pixel-ratio:2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2688.png" media="(device-width:414px) and (device-height:896px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1170-2532.png" media="(device-width:390px) and (device-height:844px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1284-2778.png" media="(device-width:428px) and (device-height:926px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1179-2556.png" media="(device-width:393px) and (device-height:852px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1290-2796.png" media="(device-width:430px) and (device-height:932px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1320-2868.png" media="(device-width:440px) and (device-height:956px) and (-webkit-device-pixel-ratio:3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1386-3024.png" media="(device-width:402px) and (device-height:874px) and (-webkit-device-pixel-ratio:3)" />
        {/* Synchronous blocking script — runs before CSS, before body, before first paint.
            Sets background dark on the document root immediately so WKWebView (iOS PWA)
            never shows its default white background. */}
        <script dangerouslySetInnerHTML={{ __html:
          `document.documentElement.style.background='#0d0d0d';document.documentElement.style.overflow='hidden';`
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ background: '#0d0d0d' }}>

        {/* All styles inline — no dependency on CSS load order */}
        <div id="kairo-splash" style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0d0d0d', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kairo-wordmark-cropped.png"
            alt="Kairo"
            style={{ width: '68vw', maxWidth: '680px', height: 'auto' }}
          />
        </div>

        <div id="kairo-root" style={{ opacity: 0 }}>
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
            var splash = document.getElementById('kairo-splash');
            var root   = document.getElementById('kairo-root');
            setTimeout(function() {
              document.documentElement.style.overflow = '';
              root.style.transition   = 'opacity 0.6s ease';
              root.style.opacity      = '1';
              splash.style.transition = 'opacity 0.8s ease';
              splash.style.opacity    = '0';
              setTimeout(function() { splash.remove(); }, 800);
            }, 4000);
          })();
        `}} />
      </body>
    </html>
  );
}
