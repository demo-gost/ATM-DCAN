import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { encodeHamming } from '../utils/hamming';

export default function HammingEncodingSection({ binaryData, onComplete }) {
  const [step, setStep] = useState(0); // 0: init, 1: show positions, 2: calc parity, 3: done
  const [currentParityIdx, setCurrentParityIdx] = useState(-1);
  const containerRef = useRef(null);
  const bitsRef = useRef(null);
  const labelRef = useRef(null);

  const { encoded, parityPositions } = encodeHamming(binaryData);

  useEffect(() => {
    const tl = gsap.timeline();

    // Step 1: Reveal encoded positions
    tl.call(() => setStep(1), null, 0.5);

    // Animate bits appearing
    tl.call(() => {
      const cells = bitsRef.current?.querySelectorAll('.enc-bit');
      if (cells) {
        gsap.fromTo(cells,
          { opacity: 0, scale: 0.5, y: 20 },
          {
            opacity: 1, scale: 1, y: 0,
            stagger: 0.08, duration: 0.4,
            ease: 'back.out(1.7)',
          }
        );
      }
    }, null, 0.8);

    // Step 2: Highlight parity calculations one by one
    tl.call(() => setStep(2), null, '+=1.5');

    parityPositions.forEach((_, idx) => {
      tl.call(() => setCurrentParityIdx(idx), null, `+=${1.2}`);
    });

    // Step 3: Done
    tl.call(() => {
      setStep(3);
      setCurrentParityIdx(-1);
    }, null, '+=1.5');

    // Auto advance
    tl.call(() => {
      setTimeout(() => onComplete(encoded), 1500);
    }, null, '+=1');

    return () => tl.kill();
  }, []);

  const getHighlightedPositions = () => {
    if (currentParityIdx < 0 || !parityPositions[currentParityIdx]) return [];
    const pp = parityPositions[currentParityIdx];
    const positions = [];
    for (let pos = 1; pos <= encoded.length; pos++) {
      if (pos & pp) positions.push(pos);
    }
    return positions;
  };

  const highlightedPositions = getHighlightedPositions();

  return (
    <div ref={containerRef} className="section-container">
      <h2 className="section-title">
        <span className="neon-text-blue">Hamming Code</span> Encoding
      </h2>
      <p className="section-subtitle">
        Adding parity bits to protect data during transmission
      </p>

      {/* Status label */}
      <div ref={labelRef} style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        marginBottom: '2rem',
        padding: '0.5rem 1.5rem',
        borderRadius: '8px',
        background: step === 3
          ? 'rgba(34, 197, 94, 0.1)'
          : 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${step === 3 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        color: step === 3 ? 'var(--accent-green)' : 'var(--accent-blue)',
        transition: 'all 0.5s ease',
      }}>
        {step < 2 && '📡 Inserting parity bits at positions 1, 2, 4, 8...'}
        {step === 2 && `🔍 Checking parity P${parityPositions[currentParityIdx] || ''}...`}
        {step === 3 && '✅ Encoded Data Ready'}
      </div>

      {/* Bit array visualization */}
      <div className="glass-card" style={{
        padding: '2rem',
        maxWidth: '700px',
        width: '100%',
      }}>
        {/* Legend */}
        <div style={{
          display: 'flex', gap: '1.5rem', marginBottom: '1.5rem',
          justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '3px',
              background: 'rgba(139, 92, 246, 0.3)', border: '1px solid rgba(139, 92, 246, 0.5)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Parity Bits
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '3px',
              background: 'rgba(6, 214, 160, 0.15)', border: '1px solid rgba(6, 214, 160, 0.3)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Data Bits
            </span>
          </div>
        </div>

        {/* Bits */}
        <div ref={bitsRef} style={{
          display: 'flex', gap: '0.4rem', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '1.5rem',
        }}>
          {encoded.map((bit, i) => {
            const isHighlighted = highlightedPositions.includes(bit.position);
            const isParity = bit.type === 'parity';
            const isCurrentParity = step === 2 && parityPositions[currentParityIdx] === bit.position;

            return (
              <div key={i} className="enc-bit" style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0.3rem', opacity: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: isParity ? 'var(--accent-purple)' : 'var(--text-secondary)',
                }}>
                  {isParity ? `P${bit.position}` : `D`}
                </span>
                <div
                  className={`bit-cell ${isParity ? 'parity' : 'data'}`}
                  style={{
                    transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isCurrentParity
                      ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)'
                      : isHighlighted
                        ? '0 0 12px rgba(59, 130, 246, 0.4)'
                        : 'none',
                    transition: 'all 0.3s ease',
                    borderColor: isHighlighted ? 'var(--accent-blue)' : undefined,
                  }}
                >
                  {step >= 1 ? bit.value : '?'}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--text-secondary)',
                  opacity: 0.6,
                }}>
                  {bit.position}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current operation info */}
        {step === 2 && currentParityIdx >= 0 && (
          <div style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent-blue)',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
          }}>
            P{parityPositions[currentParityIdx]} checks positions:{' '}
            {highlightedPositions.join(', ')}
          </div>
        )}

        {step === 3 && (
          <div style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--accent-green)',
            marginTop: '0.5rem',
          }}>
            Final encoded: [{encoded.map(b => b.value).join('')}]
          </div>
        )}
      </div>
    </div>
  );
}
