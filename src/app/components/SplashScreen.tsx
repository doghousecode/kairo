'use client';

import { useState } from 'react';

export default function SplashScreen() {
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <div
      onAnimationEnd={() => setDone(true)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d0d0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'kairoSplash 2.6s ease forwards',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes kairoSplash {
          0%   { opacity: 0; }
          22%  { opacity: 1; }
          72%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <img
        src="/kairo-wordmark-cropped.png"
        alt="Kairo"
        style={{ width: '72vw', maxWidth: '820px', height: 'auto' }}
      />
    </div>
  );
}
