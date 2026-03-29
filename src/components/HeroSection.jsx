import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection({ onComplete }) {
  const sectionRef = useRef(null);
  const figureRef = useRef(null);
  const textRef = useRef(null);
  const atmRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate stars appearing
    tl.fromTo(
      starsRef.current?.children || [],
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, stagger: 0.05, duration: 0.3, ease: 'back.out(1.7)' }
    );

    // ATM appears
    tl.fromTo(
      atmRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
      0.3
    );

    // Person walks in from left
    tl.fromTo(
      figureRef.current,
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' },
      0.8
    );

    // Text appears
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      1.5
    );

    return () => tl.kill();
  }, []);

  return (
    <div ref={sectionRef} className="section-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated stars/particles background */}
      <div ref={starsRef} style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            borderRadius: '50%',
            background: `rgba(6, 214, 160, ${Math.random() * 0.5 + 0.1})`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Scene: ATM booth */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
      }}>
        {/* ATM + Person */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '1rem',
          marginBottom: '2rem',
        }}>
          {/* Walking figure */}
          <div ref={figureRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="60" height="120" viewBox="0 0 60 120">
              {/* Head */}
              <circle cx="30" cy="15" r="12" fill="#64748b" />
              {/* Body */}
              <line x1="30" y1="27" x2="30" y2="70" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              {/* Arms */}
              <line x1="30" y1="40" x2="10" y2="55" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="40" x2="50" y2="50" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              {/* Card in hand */}
              <rect x="45" y="44" width="14" height="9" rx="1.5" fill="#06d6a0" opacity="0.8" />
              {/* Legs */}
              <line x1="30" y1="70" x2="15" y2="100" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="70" x2="45" y2="100" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              {/* Feet */}
              <line x1="15" y1="100" x2="8" y2="105" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              <line x1="45" y1="100" x2="52" y2="105" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* ATM Machine */}
          <div ref={atmRef}>
            <svg width="160" height="220" viewBox="0 0 160 220">
              {/* ATM body */}
              <rect x="10" y="10" width="140" height="200" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              {/* Screen */}
              <rect x="25" y="25" width="110" height="70" rx="6" fill="#0f172a" stroke="#06d6a0" strokeWidth="1" opacity="0.8" />
              {/* Screen text */}
              <text x="80" y="55" textAnchor="middle" fill="#06d6a0" fontSize="8" fontFamily="monospace">WELCOME</text>
              <text x="80" y="70" textAnchor="middle" fill="#06d6a0" fontSize="6" fontFamily="monospace" opacity="0.7">INSERT CARD</text>
              {/* Screen glow */}
              <rect x="25" y="25" width="110" height="70" rx="6" fill="none" stroke="#06d6a0" strokeWidth="0.5" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
              </rect>
              {/* Keypad */}
              {[0, 1, 2].map(row =>
                [0, 1, 2].map(col => (
                  <rect
                    key={`${row}-${col}`}
                    x={35 + col * 30}
                    y={110 + row * 22}
                    width="22"
                    height="16"
                    rx="3"
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="0.5"
                  />
                ))
              )}
              {/* Card slot */}
              <rect x="55" y="185" width="50" height="6" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              {/* Card slot glow */}
              <rect x="55" y="185" width="50" height="6" rx="3" fill="none" stroke="#06d6a0" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
              </rect>
              {/* Cash dispenser */}
              <rect x="40" y="175" width="80" height="4" rx="2" fill="#1a2744" stroke="#334155" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Hero text */}
        <div ref={textRef} style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 className="section-title" style={{
            background: 'linear-gradient(135deg, #06d6a0, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
          }}>
            What if 1 bit changes your bank balance?
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}>
            Discover how <span className="neon-text-cyan">Hamming Code</span> protects your money
            during every ATM transaction — through an interactive visual journey.
          </p>
          <button
            onClick={onComplete}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '14px',
              border: '1px solid rgba(6, 214, 160, 0.3)',
              background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.15), rgba(59, 130, 246, 0.1))',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'linear-gradient(135deg, rgba(6, 214, 160, 0.25), rgba(59, 130, 246, 0.2))';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--neon-cyan)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'linear-gradient(135deg, rgba(6, 214, 160, 0.15), rgba(59, 130, 246, 0.1))';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Begin the Journey →
          </button>
        </div>
      </div>
    </div>
  );
}
