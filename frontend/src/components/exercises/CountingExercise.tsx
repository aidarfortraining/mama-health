import { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { Button } from '../common/Button';
import { Timer } from '../common/Timer';
import { Card } from '../common/Card';

interface CountingExerciseProps {
  onComplete: (result: { time_seconds: number }) => void;
}

export function CountingExercise({ onComplete }: CountingExerciseProps) {
  const [phase, setPhase] = useState<'ready' | 'counting' | 'done'>('ready');
  const timer = useTimer({ initialSeconds: 0, countUp: true });

  const handleStart = () => {
    setPhase('counting');
    timer.start();
  };

  const handleDone = () => {
    timer.stop();
    setPhase('done');
    onComplete({ time_seconds: timer.seconds });
  };

  return (
    <Card className="max-w-2xl mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
        🔢 Счёт вслух
      </h1>

      {phase === 'ready' && (
        <div className="animate-fade-in">
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100 shadow-md">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
              Считайте вслух от <span className="text-primary font-bold text-xl sm:text-2xl md:text-3xl">1 до 120</span>
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-3">
              Произносите числа как можно быстрее и чётче
            </p>
          </div>
          <Button size="large" onClick={handleStart} className="w-full sm:w-auto">
            <span className="text-2xl md:text-3xl">▶️</span>
            <span>СТАРТ</span>
          </Button>
        </div>
      )}

      {phase === 'counting' && (
        <div className="animate-fade-in">
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 shadow-inner">
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6">
              <div className="text-center bg-white px-5 py-4 sm:px-7 sm:py-5 rounded-2xl shadow-md border border-blue-200">
                <div className="text-4xl sm:text-5xl md:text-6xl text-primary font-bold">1</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">Начало</div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl text-primary font-bold animate-pulse">→</div>
              <div className="text-center bg-white px-5 py-4 sm:px-7 sm:py-5 rounded-2xl shadow-md border border-blue-200">
                <div className="text-4xl sm:text-5xl md:text-6xl text-primary font-bold">120</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">Конец</div>
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-bold mb-2">
              Считайте вслух от 1 до 120!
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              Произносите числа чётко и громко
            </p>
          </div>

          <div className="mb-8">
            <Timer formatted={timer.formatted} label="Время" />
          </div>

          <Button size="large" variant="success" onClick={handleDone} className="w-full sm:w-auto">
            <span className="text-2xl md:text-3xl">✓</span>
            <span>ГОТОВО</span>
          </Button>
        </div>
      )}

      {phase === 'done' && (
        <div className="animate-fade-in">
          <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-bounce-in">🎉</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-success font-bold mb-6">Отлично!</h2>
          <div className="inline-block px-8 py-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg border-2 border-green-100">
            <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">Ваше время:</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {timer.formatted}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
