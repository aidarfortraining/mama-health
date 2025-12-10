import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
  countUp?: boolean;
}

export function useTimer({ initialSeconds, onComplete, autoStart = false, countUp = false }: UseTimerOptions) {
  const [seconds, setSeconds] = useState(countUp ? 0 : initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setSeconds(countUp ? 0 : initialSeconds);
    setIsRunning(false);
  }, [initialSeconds, countUp]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (countUp) {
            return prev + 1;
          } else {
            if (prev <= 1) {
              setIsRunning(false);
              onComplete?.();
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, countUp, onComplete]);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    isRunning,
    formatted: formatTime(seconds),
    start,
    stop,
    reset,
  };
}
