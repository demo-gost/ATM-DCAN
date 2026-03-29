import { useState, useRef, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ATMInterface from './components/ATMInterface';
import BinaryConversionSection from './components/BinaryConversionSection';
import HammingEncodingSection from './components/HammingEncodingSection';
import ErrorSimulationSection from './components/ErrorSimulationSection';
import DetectionCorrectionSection from './components/DetectionCorrectionSection';
import ResultSection from './components/ResultSection';
import gsap from 'gsap';

const PHASES = [
  { key: 'hero', label: 'Welcome' },
  { key: 'atm', label: 'ATM' },
  { key: 'binary', label: 'Binary' },
  { key: 'encode', label: 'Encode' },
  { key: 'error', label: 'Error' },
  { key: 'detect', label: 'Detect' },
  { key: 'result', label: 'Result' },
];

function ProgressBar({ currentPhase }) {
  const currentIdx = PHASES.findIndex(p => p.key === currentPhase);

  return (
    <div className="progress-track">
      {PHASES.map((phase, idx) => (
        <div key={phase.key} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`progress-step ${
            idx === currentIdx ? 'active' :
            idx < currentIdx ? 'completed' : ''
          }`}>
            <div className="progress-dot" />
            <span>{phase.label}</span>
          </div>
          {idx < PHASES.length - 1 && (
            <div className={`progress-line ${idx < currentIdx ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState('hero');
  const [amount, setAmount] = useState(null);
  const [binaryData, setBinaryData] = useState(null);
  const [encodedData, setEncodedData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [correctedData, setCorrectedData] = useState(null);
  const contentRef = useRef(null);

  const transitionTo = (newPhase) => {
    // Fade out current content
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setPhase(newPhase);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Fade in new content
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
      },
    });
  };

  const handleHeroComplete = () => transitionTo('atm');

  const handleAmountSubmit = (amt) => {
    setAmount(amt);
    transitionTo('binary');
  };

  const handleBinaryComplete = (binary) => {
    setBinaryData(binary);
    transitionTo('encode');
  };

  const handleEncodeComplete = (encoded) => {
    setEncodedData(encoded);
    transitionTo('error');
  };

  const handleErrorComplete = (errData) => {
    setErrorData(errData);
    transitionTo('detect');
  };

  const handleDetectComplete = (corrected) => {
    setCorrectedData(corrected);
    transitionTo('result');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background grid */}
      <div className="grid-bg" />

      {/* Progress bar */}
      <ProgressBar currentPhase={phase} />

      {/* Content area */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 1, paddingTop: '60px' }}>
        {phase === 'hero' && (
          <HeroSection onComplete={handleHeroComplete} />
        )}

        {phase === 'atm' && (
          <ATMInterface onSubmit={handleAmountSubmit} />
        )}

        {phase === 'binary' && amount && (
          <BinaryConversionSection amount={amount} onComplete={handleBinaryComplete} />
        )}

        {phase === 'encode' && binaryData && (
          <HammingEncodingSection binaryData={binaryData} onComplete={handleEncodeComplete} />
        )}

        {phase === 'error' && encodedData && (
          <ErrorSimulationSection encodedData={encodedData} onComplete={handleErrorComplete} />
        )}

        {phase === 'detect' && errorData && (
          <DetectionCorrectionSection errorData={errorData} onComplete={handleDetectComplete} />
        )}

        {phase === 'result' && correctedData && (
          <ResultSection correctedData={correctedData} originalAmount={amount} />
        )}
      </div>
    </div>
  );
}

export default App;
