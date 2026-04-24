import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(onExpire: () => void) {
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerMinutes(null);
    setRemaining(0);
  }, []);

  const startTimer = useCallback((minutes: number) => {
    clearTimer();
    setTimerMinutes(minutes);
    setRemaining(minutes * 60);

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTimerMinutes(null);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, onExpire]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const formatRemaining = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return { timerMinutes, remaining, formatRemaining, startTimer, clearTimer };
}
