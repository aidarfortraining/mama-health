import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../../hooks/useTimer';

describe('useTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('countdown mode (default)', () => {
        it('initializes with correct seconds', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));
            expect(result.current.seconds).toBe(60);
        });

        it('formats time correctly', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 90 }));
            expect(result.current.formatted).toBe('01:30');
        });

        it('does not start automatically by default', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));
            expect(result.current.isRunning).toBe(false);
        });

        it('starts counting when start is called', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));

            act(() => {
                result.current.start();
            });

            expect(result.current.isRunning).toBe(true);
        });

        it('counts down each second', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(result.current.seconds).toBe(59);
        });

        it('stops at zero and calls onComplete', () => {
            const onComplete = vi.fn();
            const { result } = renderHook(() =>
                useTimer({ initialSeconds: 2, onComplete })
            );

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(2000);
            });

            expect(result.current.seconds).toBe(0);
            expect(onComplete).toHaveBeenCalled();
        });

        it('stops counting when stop is called', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            act(() => {
                result.current.stop();
            });

            expect(result.current.isRunning).toBe(false);
            expect(result.current.seconds).toBe(59);
        });

        it('resets to initial value', () => {
            const { result } = renderHook(() => useTimer({ initialSeconds: 60 }));

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(5000);
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.seconds).toBe(60);
            expect(result.current.isRunning).toBe(false);
        });
    });

    describe('countup mode', () => {
        it('initializes at zero when countUp is true', () => {
            const { result } = renderHook(() =>
                useTimer({ initialSeconds: 0, countUp: true })
            );
            expect(result.current.seconds).toBe(0);
        });

        it('counts up each second', () => {
            const { result } = renderHook(() =>
                useTimer({ initialSeconds: 0, countUp: true })
            );

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            expect(result.current.seconds).toBe(3);
        });

        it('formats countup time correctly', () => {
            const { result } = renderHook(() =>
                useTimer({ initialSeconds: 0, countUp: true })
            );

            act(() => {
                result.current.start();
            });

            act(() => {
                vi.advanceTimersByTime(65000); // 1:05
            });

            expect(result.current.formatted).toBe('01:05');
        });
    });

    describe('autoStart', () => {
        it('starts automatically when autoStart is true', () => {
            const { result } = renderHook(() =>
                useTimer({ initialSeconds: 60, autoStart: true })
            );

            expect(result.current.isRunning).toBe(true);
        });
    });
});
