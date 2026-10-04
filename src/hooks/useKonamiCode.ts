import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

export function useKonamiCode(onSuccess: () => void) {
  const [inputIndex, setInputIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = KONAMI_SEQUENCE[inputIndex];

      if (key === expectedKey || (expectedKey.length === 1 && key.toLowerCase() === expectedKey)) {
        const nextIndex = inputIndex + 1;
        if (nextIndex === KONAMI_SEQUENCE.length) {
          // Success!
          setInputIndex(0);
          sound.playSuccess();

          // Sakura blossom confetti storm
          try {
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#FFB7B2', '#FF9AA2', '#FFDAC1', '#FFB6C1', '#F78FB3', '#E77F67']
            });

            setTimeout(() => {
              confetti({
                particleCount: 70,
                angle: 60,
                spread: 70,
                origin: { x: 0.1, y: 0.6 },
                colors: ['#FFB7B2', '#FF9AA2', '#F472B6']
              });
              confetti({
                particleCount: 70,
                angle: 120,
                spread: 70,
                origin: { x: 0.9, y: 0.6 },
                colors: ['#FFB7B2', '#FF9AA2', '#C084FC']
              });
            }, 300);
          } catch {}

          onSuccess();
        } else {
          setInputIndex(nextIndex);
        }
      } else {
        // Reset if key is wrong
        setInputIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputIndex, onSuccess]);
}
