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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ background: '#0d0d0d' }}>

        {/* Splash overlay — styled via globals.css so it's in the CSS bundle */}
        <div id="kairo-splash">
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
