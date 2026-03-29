import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { detectError, correctError } from '../utils/hamming';

export default function DetectionCorrectionSection({ errorData, onComplete }) {
  const [phase, setPhase] = useState(0); // 0: init, 1: scanning, 2: checking, 3: found, 4: corrected
  const [currentCheckIdx, setCurrentCheckIdx] = useState(-1);
  const [scanPosition, setScanPosition] = useState(-1);
  const [correctedBits, setCorrectedBits] = useState(null);
  const containerRef = useRef(null);
  const bitsRef = useRef(null);
  const messageRef = useRef(null);

  const { corrupted, errorPosition } = errorData;
  const { errorPosition: detectedPosition, parityChecks } = detectError(corrupted);

  useEffect(() => {
    const tl = gsap.timeline();

    // Show bits
    tl.call(() => {
      const cells = bitsRef.current?.querySelectorAll('.det-bit');
      if (cells) {
        gsap.fromTo(cells,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' }
        );
      }
    }, null, 0.3);

    // Phase 1: Scanning animation
    tl.call(() => setPhase(1), null, '+=0.8');

    // Scan across bits
    for (let i = 0; i < corrupted.length; i++) {
      tl.call(() => setScanPosition(i), null, `+=${0.1}`);
    }

    tl.call(() => {
      setScanPosition(-1);
      setPhase(2);
    }, null, '+=0.5');

    // Phase 2: Check each parity
    parityChecks.forEach((_, idx) => {
      tl.call(() => setCurrentCheckIdx(idx), null, `+=${1}`);
    });

    // Phase 3: Error found
    tl.call(() => {
      setPhase(3);
      setCurrentCheckIdx(-1);
    }, null, '+=1');

    // Phase 4: Correct
    tl.call(() => {
      const fixed = correctError(corrupted, detectedPosition);
      setCorrectedBits(fixed);
      setPhase(4);
    }, null, '+=1.5');

    // Auto advance
    tl.call(() => {
      const fixed = correctError(corrupted, detectedPosition);
      setTimeout(() => onComplete(fixed), 2000);
    }, null, '+=1.5');

    return () => tl.kill();
  }, []);

  const displayBits = correctedBits || corrupted;

  return (
    <div ref={containerRef} className="section-container">
      <h2 className="section-title">
        <span className="neon-text-green">Error Detection</span> & Correction
      </h2>
      <p className="section-subtitle">
        Hamming Code identifies and fixes the corrupted bit
      </p>

      {/* Status indicator */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        marginBottom: '2rem',
        padding: '0.5rem 1.5rem',
        borderRadius: '8px',
        background: phase === 4
          ? 'rgba(34, 197, 94, 0.1)'
          : phase === 3
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${
          phase === 4 ? 'rgba(34, 197, 94, 0.3)' :
          phase === 3 ? 'rgba(239, 68, 68, 0.3)' :
          'rgba(59, 130, 246, 0.3)'
        }`,
        color: phase === 4 ? 'var(--accent-green)' :
               phase === 3 ? 'var(--accent-red)' :
               'var(--accent-blue)',
        transition: 'all 0.5s ease',
      }}>
        {phase <= 1 && '🔍 Scanning transmitted data...'}
        {phase === 2 && `📊 Checking parity P${parityChecks[currentCheckIdx]?.parityPosition || ''}...`}
        {phase === 3 && `⚠ Error detected at position ${detectedPosition}!`}
        {phase === 4 && '✅ Error detected and corrected successfully!'}
      </div>

      {/* Bits display with scan effect */}
      <div className="glass-card" style={{
        padding: '2rem',
        maxWidth: '700px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scan beam */}
        {phase === 1 && scanPosition >= 0 && (
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${(scanPosition / corrupted.length) * 100}%`,
            width: '40px',
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.15), transparent)',
            transition: 'left 0.1s ease',
            pointerEvents: 'none',
            zIndex: 5,
          }} />
        )}

        <div ref={bitsRef} style={{
          display: 'flex', gap: '0.4rem', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '1.5rem',
        }}>
          {displayBits.map((bit, i) => {
            const isScanning = phase === 1 && i === scanPosition;
            const isErrorBit = bit.isError && phase < 4;
            const isCorrected = phase === 4 && bit.corrected;
            const isBeingChecked = phase === 2 && currentCheckIdx >= 0 &&
              ((i + 1) & parityChecks[currentCheckIdx]?.parityPosition);

            return (
              <div key={i} className="det-bit" style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '0.3rem', opacity: 0,
              }}>
                <div
                  className={`bit-cell ${
                    isCorrected ? 'corrected' :
                    isErrorBit && phase >= 3 ? 'error' :
                    isScanning ? 'scanning' :
                    isBeingChecked ? 'scanning' :
                    bit.type === 'parity' ? 'parity' : 'data'
                  }`}
                  style={{
                    transform: isScanning || isBeingChecked ? 'scale(1.1)' :
                              isCorrected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {bit.value}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  color: isCorrected ? 'var(--accent-green)' :
                         isErrorBit && phase >= 3 ? 'var(--accent-red)' :
                         'var(--text-secondary)',
                  opacity: 0.7,
                }}>
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Parity check results */}
        {phase >= 2 && (
          <div style={{
            display: 'flex', gap: '0.5rem', justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {parityChecks.map((check, idx) => (
              <div key={idx} style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                background: idx <= currentCheckIdx || phase >= 3
                  ? check.pass
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  idx <= currentCheckIdx || phase >= 3
                    ? check.pass
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(255,255,255,0.08)'
                }`,
                color: idx <= currentCheckIdx || phase >= 3
                  ? check.pass ? 'var(--accent-green)' : 'var(--accent-red)'
                  : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                opacity: idx <= currentCheckIdx || phase >= 3 ? 1 : 0.3,
              }}>
                P{check.parityPosition}: {idx <= currentCheckIdx || phase >= 3
                  ? check.pass ? '✓' : '✗'
                  : '?'
                }
              </div>
            ))}
          </div>
        )}

        {/* Error position calculation */}
        {phase >= 3 && (
          <div style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: phase === 4 ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            {phase === 3 && (
              <>
                Error position = {parityChecks.filter(c => !c.pass).map(c => c.parityPosition).join(' + ')} = {detectedPosition}
              </>
            )}
            {phase === 4 && (
              <>
                Bit at position {detectedPosition} has been corrected ✓
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
