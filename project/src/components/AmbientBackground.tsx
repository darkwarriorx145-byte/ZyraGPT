import { useEffect, useState } from 'react';

export default function AmbientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Radial glow — top left (ember) */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* Radial glow — top right (amber) */}
      <div
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Radial glow — bottom center (ember) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] animate-pulse-glow"
        style={{
          background: 'radial-gradient(ellipse, rgba(234,88,12,0.10) 0%, transparent 70%)',
          animationDelay: '1.5s',
        }}
      />

      {/* Radial glow — mid left (amber) */}
      <div
        className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(9,13,22,0.6) 100%)',
        }}
      />
    </div>
  );
}
