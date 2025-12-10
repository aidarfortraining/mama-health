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
      <h1 className="text-heading mb-6">Счёт вслух</h1>

      {phase === 'ready' && (
        <>
          <p className="text-body mb-8 text-gray-700">
            Считайте вслух от <strong>1 до 120</strong> как можно быстрее и чётче.
          </p>
          <Button size="large" onClick={handleStart}>
            СТАРТ
          </Button>
        </>
      )}

      {phase === 'counting' && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-display text-primary font-bold">1</div>
                <div className="text-small text-gray-500">Начало</div>
              </div>
              <div className="text-heading text-gray-400">→</div>
              <div className="text-center">
                <div className="text-display text-primary font-bold">120</div>
                <div className="text-small text-gray-500">Конец</div>
              </div>
            </div>
            <p className="text-large text-gray-700 font-semibold">Считайте вслух от 1 до 120!</p>
            <p className="text-body text-gray-500 mt-2">Произносите числа чётко и громко</p>
          </div>

          <Timer formatted={timer.formatted} label="Время" />

          <div className="mt-8">
            <Button size="large" variant="success" onClick={handleDone}>
              ГОТОВО
            </Button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <>
          <p className="text-heading text-success mb-4">Отлично!</p>
          <p className="text-body">Ваше время: {timer.formatted}</p>
        </>
      )}
    </Card>
  );
}
