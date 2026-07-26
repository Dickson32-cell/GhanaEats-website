import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiCelebration = ({ trigger }) => {
  useEffect(() => {
    if (!trigger) return;

    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#FFB4A2', '#E5989B', '#B5838D', '#6D6875', '#FF6B9D'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

  }, [trigger]);

  return null;
};

export default ConfettiCelebration;
