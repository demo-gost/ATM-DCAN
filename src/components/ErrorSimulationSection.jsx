import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { introduceError } from '../utils/hamming';

export default function ErrorSimulationSection({ encodedData, onComplete }) {
  const [showError, setShowError] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const containerRef = useRef(null);
  const bitsRef = useRef(null);
  const glitchOverlayRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const result = introduceError(encodedData);
    const tl = gsap.timeline();

    // Show initial encoded data
    tl.call(() => {
      const cells = bitsRef.current?.querySelectorAll('.sim-bit');
      if (cells) {
        gsap.fromTo(cells,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
        );
      }
    }, null, 0.5);

    // Dramatic pause
    tl.to({}, { duration: 1.5 });

    // Glitch effect
    tl.call(() => {
      gsap.fromTo(glitchOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, yoyo: true, repeat: 5 }
      );
    }, null, '+=0');

    // Screen shake
    tl.to(containerRef.current, {
      x: -5, duration: 0.05, yoyo: true, repeat: 10, ease: 'none',
    });

    // Reveal the error
    tl.call(() => {
      setErrorData(result);
      setShowError(true);
    }, null, '+=0.3');

    // Highlight the error bit
    tl.call(() => {
      const errorBit = bitsRef.current?.querySelector('.error-bit');
      if (errorBit) {
        gsap.fromTo(errorBit,
          { scale: 1 },
          { scale: 1.3, duration: 0.3, yoyo: true, repeat: 2, ease: 'power2.inOut' }
        );
      }
    }, null, '+=0.2');

    // Show error message
    tl.fromTo(messageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '+=0.5'
    );

    // Auto advance
    tl.call(() => {
      setTimeout(() => onComplete(result), 2500);
    }, null, '+=1.5');

    return () => tl.kill();
  }, []);

  const displayData = showError && errorData ? errorData.corrupted : encodedData;

  return (
    <div ref={containerRef} className="section-container" style={{ position: 'relative' }}>
      {/* Glitch overlay */}
      <div ref={glitchOverlayRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.03) 2px, rgba(239, 68, 68, 0.03) 4px)',
        pointerEvents: 'none', zIndex: 10, opacity: 0,
        mixBlendMode: 'overlay',
      }} />

      {/* Noise lines */}
      {showError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', zIndex: 5, overflow: 'hidden',
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              left: 0, right: 0,
              height: '1px',
              background: 'rgba(239, 68, 68, 0.15)',
              animation: `scanLine ${1 + i * 0.3}s linear infinite`,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      )}

      <h2 className="section-title">
        <span className="neon-text-red">Transmission</span> Channel
      </h2>
      <p className="section-subtitle">
        Data traveling through the network...
      </p>

      {/* Transmission wire visualization */}
      <div style={{
        marginBottom: '2rem',
        width: '100%',
        maxWidth: '500px',
        height: '4px',
        background: showError
          ? 'linear-gradient(90deg, var(--accent-cyan), var(--accent-red), var(--accent-cyan))'
          : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue), var(--accent-cyan))',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: '-50%',
          width: '50%', height: '100%',
          background: showError
            ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          animation: 'scanLine 1.5s linear infinite',
        }} />
      </div>

      {/* Bits display */}
      <div className="glass-card" style={{
        padding: '2rem',
        maxWidth: '700px',
        width: '100%',
        border: showError ? '1px solid rgba(239, 68, 68, 0.2)' : undefined,
        transition: 'border-color 0.3s ease',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem',
          textAlign: 'center',
          letterSpacing: '0.1em',
        }}>
          {showError ? '⚠ CORRUPTED DATA' : 'TRANSMITTED DATA'}
        </div>

        <div ref={bitsRef} style={{
          display: 'flex',
          gap: '0.4rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {displayData.map((bit, i) => {
            const isErrorBit = showError && errorData && bit.isError;
            return (
              <div key={i}
                className={`sim-bit ${isErrorBit ? 'error-bit' : ''}`}
                style={{ opacity: 0 }}
              >
                <div
                  className={`bit-cell ${isErrorBit ? 'error' : bit.type === 'parity' ? 'parity' : 'data'}`}
                >
                  {bit.value}
                </div>
              </div>
            );
          })}
        </div>

        {showError && errorData && (
          <div style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--accent-red)',
          }}>
            Bit at position {errorData.errorPosition} flipped:
            {' '}{errorData.originalValue} → {errorData.originalValue === 0 ? 1 : 0}
          </div>
        )}
      </div>

      {/* Error message */}
      <div ref={messageRef} style={{
        opacity: 0,
        marginTop: '2rem',
        padding: '1rem 2rem',
        borderRadius: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--accent-red)',
          textShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
          marginBottom: '0.3rem',
        }}>
          ⚠ Error occurred during transmission
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
        }}>
          Noise in the channel has corrupted the data
        </div>
      </div>
    </div>
  );
}
