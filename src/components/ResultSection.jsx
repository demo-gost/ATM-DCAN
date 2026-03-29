import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { extractDataBits, binaryToDecimal } from '../utils/hamming';

export default function ResultSection({ correctedData, originalAmount }) {
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const checkRef = useRef(null);
  const amountRef = useRef(null);

  const dataBits = extractDataBits(correctedData);
  const recoveredBinary = dataBits.join('');
  const recoveredAmount = binaryToDecimal(recoveredBinary);

  useEffect(() => {
    const tl = gsap.timeline();

    // Convert binary back animation
    tl.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      0.5
    );

    // Show checkmark
    tl.call(() => setShowResult(true), null, '+=0.5');

    tl.fromTo(checkRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '+=0.3'
    );

    // Show amount
    tl.fromTo(amountRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '+=0.3'
    );

    // Confetti
    tl.call(() => setShowConfetti(true), null, '+=0.2');

    return () => tl.kill();
  }, []);

  // Confetti particles
  const confettiColors = ['#06d6a0', '#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444'];

  return (
    <div ref={containerRef} className="section-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      {showConfetti && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', zIndex: 10,
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: confettiColors[i % confettiColors.length],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confettiFall ${2 + Math.random() * 3}s ease-in forwards`,
              animationDelay: `${Math.random() * 1}s`,
              opacity: 0.8,
            }} />
          ))}
        </div>
      )}

      <h2 className="section-title neon-text-green">Transaction Result</h2>

      <div ref={cardRef} className="glass-card" style={{
        padding: '3rem 2.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        border: showResult ? '1px solid rgba(34, 197, 94, 0.3)' : undefined,
      }}>
        {/* Green glow behind */}
        {showResult && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px', height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Binary to decimal */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ marginBottom: '0.3rem' }}>CORRECTED BINARY</div>
          <div style={{
            display: 'flex', gap: '0.25rem', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '0.75rem',
          }}>
            {recoveredBinary.split('').map((bit, i) => (
              <span key={i} style={{
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: 'var(--accent-green)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                {bit}
              </span>
            ))}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
            {recoveredBinary}<sub>2</sub> → {recoveredAmount}<sub>10</sub>
          </div>
        </div>

        {/* Checkmark */}
        <div ref={checkRef} style={{
          opacity: 0,
          marginBottom: '1.5rem',
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.3" />
            <circle cx="40" cy="40" r="36" fill="rgba(34, 197, 94, 0.1)" />
            <path
              d="M24 40 L35 52 L56 28"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              style={{
                animation: showResult ? 'checkmark 0.6s ease forwards' : 'none',
              }}
            />
          </svg>
        </div>

        {/* Success text */}
        <div ref={amountRef} style={{ opacity: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--accent-green)',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}>
            TRANSACTION SUCCESSFUL
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 800,
            color: 'var(--accent-green)',
            textShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)',
            marginBottom: '0.5rem',
          }}>
            ₹{originalAmount.toLocaleString()}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            Amount verified • Error corrected • Data integrity confirmed
          </div>
        </div>
      </div>

      {/* Summary card */}
      {showResult && (
        <div className="glass-card" style={{
          padding: '1.5rem 2rem',
          maxWidth: '480px',
          width: '100%',
          marginTop: '1.5rem',
          animation: 'slideUp 0.5s ease forwards',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}>
            HOW HAMMING CODE SAVED YOUR MONEY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '💰', text: 'Amount entered at ATM', color: 'var(--accent-cyan)' },
              { icon: '🔢', text: 'Converted to binary & encoded with parity', color: 'var(--accent-blue)' },
              { icon: '⚡', text: 'Noise corrupted 1 bit during transmission', color: 'var(--accent-red)' },
              { icon: '🔍', text: 'Hamming Code detected the error position', color: 'var(--accent-amber)' },
              { icon: '✅', text: 'Bit corrected — correct amount delivered', color: 'var(--accent-green)' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: item.color,
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restart hint */}
      {showResult && (
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '2rem',
            padding: '0.8rem 2rem',
            borderRadius: '12px',
            border: '1px solid rgba(6, 214, 160, 0.2)',
            background: 'rgba(6, 214, 160, 0.05)',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'slideUp 0.5s ease forwards',
            animationDelay: '0.3s',
            opacity: 0,
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(6, 214, 160, 0.15)';
            e.target.style.boxShadow = 'var(--neon-cyan)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(6, 214, 160, 0.05)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ↺ Try Again with Different Amount
        </button>
      )}
    </div>
  );
}
