import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { decimalToBinary } from '../utils/hamming';

export default function BinaryConversionSection({ amount, onComplete }) {
  const [phase, setPhase] = useState(0); // 0: amount, 1: signal, 2: binary
  const containerRef = useRef(null);
  const amountRef = useRef(null);
  const signalRef = useRef(null);
  const binaryRef = useRef(null);
  const arrowRefs = useRef([]);

  const binary = decimalToBinary(amount);

  useEffect(() => {
    const tl = gsap.timeline();

    // Phase 1: Show the amount
    tl.fromTo(amountRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // Arrow 1
    tl.call(() => setPhase(1), null, '+=0.5');
    tl.fromTo(arrowRefs.current[0],
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' },
      '+=0.2'
    );

    // Phase 2: Digital signal animation
    tl.fromTo(signalRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '+=0.2'
    );

    // Arrow 2
    tl.call(() => setPhase(2), null, '+=0.8');
    tl.fromTo(arrowRefs.current[1],
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' },
      '+=0.2'
    );

    // Phase 3: Binary bits appear one by one
    tl.fromTo(binaryRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      '+=0.2'
    );

    // Stagger reveal each bit
    tl.call(() => {
      const bits = binaryRef.current?.querySelectorAll('.bit-reveal');
      if (bits) {
        gsap.fromTo(bits,
          { opacity: 0, y: 20, scale: 0.5 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.4, ease: 'back.out(1.7)' }
        );
      }
    }, null, '+=0.1');

    // Auto advance
    tl.call(() => {
      setTimeout(() => onComplete(binary), 2000);
    }, null, '+=2');

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="section-container">
      <h2 className="section-title neon-text-cyan">Data Conversion</h2>
      <p className="section-subtitle">Transforming your amount into binary data for transmission</p>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      }}>
        {/* Amount display */}
        <div ref={amountRef} className="glass-card" style={{
          padding: '1.5rem 3rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--text-secondary)', marginBottom: '0.5rem',
            letterSpacing: '0.1em',
          }}>
            TRANSACTION AMOUNT
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            textShadow: '0 0 20px rgba(6, 214, 160, 0.4)',
          }}>
            ₹{amount.toLocaleString()}
          </div>
        </div>

        {/* Arrow */}
        <div ref={el => arrowRefs.current[0] = el} style={{ opacity: 0 }}>
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="32" stroke="#06d6a0" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" values="8;0" dur="0.6s" repeatCount="indefinite" />
            </line>
            <polygon points="6,28 18,28 12,38" fill="#06d6a0" />
          </svg>
        </div>

        {/* Digital Signal */}
        {phase >= 1 && (
          <div ref={signalRef} className="glass-card" style={{
            padding: '1.25rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--text-secondary)', marginBottom: '0.75rem',
              letterSpacing: '0.1em',
            }}>
              DIGITAL SIGNAL
            </div>
            <svg width="200" height="50" viewBox="0 0 200 50">
              {/* Animated waveform */}
              <path
                d="M0,40 L20,40 L20,10 L40,10 L40,40 L50,40 L50,10 L60,10 L60,40 L80,40 L80,10 L100,10 L100,40 L110,40 L110,10 L140,10 L140,40 L150,40 L150,10 L170,10 L170,40 L200,40"
                fill="none"
                stroke="#06d6a0"
                strokeWidth="2"
              >
                <animate attributeName="stroke" values="#06d6a0;#3b82f6;#8b5cf6;#06d6a0" dur="2s" repeatCount="indefinite" />
              </path>
              {/* Glow */}
              <path
                d="M0,40 L20,40 L20,10 L40,10 L40,40 L50,40 L50,10 L60,10 L60,40 L80,40 L80,10 L100,10 L100,40 L110,40 L110,10 L140,10 L140,40 L150,40 L150,10 L170,10 L170,40 L200,40"
                fill="none"
                stroke="#06d6a0"
                strokeWidth="4"
                opacity="0.2"
                filter="blur(4px)"
              />
            </svg>
          </div>
        )}

        {/* Arrow */}
        <div ref={el => arrowRefs.current[1] = el} style={{ opacity: 0 }}>
          <svg width="24" height="40" viewBox="0 0 24 40">
            <line x1="12" y1="0" x2="12" y2="32" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" values="8;0" dur="0.6s" repeatCount="indefinite" />
            </line>
            <polygon points="6,28 18,28 12,38" fill="#3b82f6" />
          </svg>
        </div>

        {/* Binary bits */}
        {phase >= 2 && (
          <div ref={binaryRef} className="glass-card" style={{
            padding: '1.5rem 2rem',
            textAlign: 'center',
            opacity: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--text-secondary)', marginBottom: '1rem',
              letterSpacing: '0.1em',
            }}>
              BINARY REPRESENTATION
            </div>
            <div style={{
              display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {binary.split('').map((bit, i) => (
                <div key={i} className="bit-reveal" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  opacity: 0,
                }}>
                  <div className="bit-cell data" style={{
                    boxShadow: bit === '1'
                      ? '0 0 15px rgba(6, 214, 160, 0.4)'
                      : '0 0 8px rgba(6, 214, 160, 0.1)',
                  }}>
                    {bit}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'var(--text-secondary)',
                  }}>
                    2<sup>{binary.length - 1 - i}</sup>
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '1rem', fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem', color: 'var(--text-secondary)',
            }}>
              {amount}<sub>10</sub> = {binary}<sub>2</sub>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
