import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function ATMInterface({ onSubmit }) {
  const [amount, setAmount] = useState('');
  const [cardInserted, setCardInserted] = useState(false);
  const screenRef = useRef(null);
  const keypadRef = useRef(null);
  const cardRef = useRef(null);
  const atmBodyRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(atmBodyRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    return () => tl.kill();
  }, []);



  const handleKeyPress = (key) => {
    if (key === 'C') {
      setAmount('');
    } else if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (amount && parseInt(amount) > 0) {
        onSubmit(parseInt(amount));
      }
    } else if (amount.length < 7) {
      setAmount(prev => prev + key);
    }
  };

  const handleInsertCard = () => {
    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => setCardInserted(true),
    });
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  return (
    <div className="section-container">
      <h2 className="section-title neon-text-cyan">ATM Terminal</h2>
      <p className="section-subtitle">Enter the transaction amount</p>

      <div ref={atmBodyRef} className="glass-card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '0',
        overflow: 'hidden',
      }}>
        {/* ATM Top bar */}
        <div style={{
          background: 'linear-gradient(90deg, #1e293b, #0f172a)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(6, 214, 160, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#06d6a0', boxShadow: '0 0 8px rgba(6, 214, 160, 0.5)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--accent-cyan)', letterSpacing: '0.1em',
            }}>SECURE BANK ATM</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-secondary)',
          }}>v2.4.1</span>
        </div>

          {!cardInserted ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '2rem', gap: '1.5rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)',
                fontSize: '0.85rem', textAlign: 'center', opacity: 0.9,
              }}>
                INSERT YOUR CARD
              </div>

              {/* Card animation */}
              <div ref={cardRef} onClick={handleInsertCard} style={{
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <svg width="80" height="50" viewBox="0 0 80 50">
                  <defs>
                    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06d6a0" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <rect width="80" height="50" rx="6" fill="url(#cardGrad)" opacity="0.9" />
                  <rect x="8" y="12" width="15" height="12" rx="2" fill="#fbbf24" opacity="0.8" />
                  <line x1="8" y1="35" x2="72" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <text x="8" y="46" fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="monospace">**** **** 4289</text>
                </svg>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
                fontSize: '0.7rem', animation: 'neonPulse 2s infinite',
              }}>
                ▲ TAP CARD TO INSERT ▲
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: '#94a3b8', marginBottom: '0.75rem',
                letterSpacing: '0.1em',
              }}>
                ENTER AMOUNT (₹)
              </p>
              <div className={`atm-amount ${amount ? 'has-value' : ''}`}>
                ₹{amount || '0'}
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: '#94a3b8',
              }}>
                BALANCE: ₹98,450.00
              </p>
            </div>
          )}

        {/* Keypad */}
        {cardInserted && (
          <div ref={keypadRef} style={{ padding: '0 1.25rem 1.25rem', animation: 'slideUp 0.5s ease 0.3s both' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem', marginBottom: '0.75rem',
            }}>
              {keys.map((key) => (
                <button
                  key={key}
                  className="keypad-btn"
                  onClick={() => handleKeyPress(key)}
                  style={{
                    width: '100%',
                    color: key === 'C' ? 'var(--accent-amber)' :
                      key === '⌫' ? 'var(--accent-red)' : 'var(--text-primary)',
                  }}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Send Transaction Button */}
            <button
              onClick={() => handleKeyPress('ENTER')}
              disabled={!amount || parseInt(amount) <= 0}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                border: '1px solid rgba(6, 214, 160, 0.3)',
                background: amount && parseInt(amount) > 0
                  ? 'linear-gradient(135deg, rgba(6, 214, 160, 0.2), rgba(59, 130, 246, 0.15))'
                  : 'rgba(255,255,255,0.03)',
                color: amount && parseInt(amount) > 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: amount && parseInt(amount) > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                letterSpacing: '0.08em',
              }}
            >
              SEND TRANSACTION →
            </button>
          </div>
        )}

        {/* Card slot indicator */}
        <div style={{
          height: '4px',
          background: cardInserted
            ? 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))'
            : 'linear-gradient(90deg, rgba(100,116,139,0.2), rgba(100,116,139,0.4), rgba(100,116,139,0.2))',
          transition: 'all 0.5s ease',
        }} />
      </div>
    </div>
  );
}
