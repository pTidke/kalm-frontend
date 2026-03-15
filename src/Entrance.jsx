import { useState, useEffect } from "react";

export default function Entrance({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Stage 1: Trigger door opening after a short delay
    const openTimer = setTimeout(() => setIsOpen(true), 100);
    
    // Stage 2: Fade out and unmount after animation completes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500); // 1.2s for animation + 0.3s buffer

    return () => {
      clearTimeout(openTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`entrance-overlay ${isOpen ? "is-open" : ""}`}>
      <img src="/logo.png" alt="MyTrailer" className="entrance-logo" />
      <div className="entrance-door door-left" />
      <div className="entrance-door door-right" />
    </div>
  );
}
