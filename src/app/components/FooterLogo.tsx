'use client';

export default function FooterLogo() {
  return (
    <button
      onClick={() => (window as any).kairoShowSplash?.()}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <div className="footer-logo">
        <span className="wordmark"><span className="l-dim">k</span><span className="l-ai">ai</span><span className="l-ro">ro</span></span>
      </div>
    </button>
  );
}
