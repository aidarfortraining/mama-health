import { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Timer } from '../common/Timer';
import { Card } from '../common/Card';
import type { ReadingText } from '../../types';

interface ReadingExerciseProps {
  onComplete: (result: { completed: boolean; time_seconds: number }) => void;
}

export function ReadingExercise({ onComplete }: ReadingExerciseProps) {
  const [text, setText] = useState<ReadingText | null>(null);
  const [phase, setPhase] = useState<'ready' | 'reading' | 'done'>('ready');
  const [loading, setLoading] = useState(true);

  const timer = useTimer({ initialSeconds: 0, countUp: true });

  useEffect(() => {
    api.getReadingText().then(data => {
      setText(data);
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    setPhase('reading');
    timer.start();
  };

  const handleDone = () => {
    timer.stop();
    setPhase('done');
    onComplete({ completed: true, time_seconds: timer.seconds });
  };

  if (loading || !text) {
    return (
      <Card className="max-w-3xl mx-auto text-center">
        <p className="text-body">Загрузка текста...</p>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-heading">Чтение вслух</h1>
      </div>

      {phase === 'ready' && (
        <div className="text-center">
          <p className="text-body mb-6 text-gray-700">
            Прочитайте следующий текст вслух, чётко и внятно.
          </p>
          <p className="text-small text-gray-500 mb-8">
            {text.word_count} слов
          </p>
          <Button size="large" onClick={handleStart}>
            НАЧАТЬ ЧТЕНИЕ
          </Button>
        </div>
      )}

      {phase === 'reading' && (
        <>
          <Timer formatted={timer.formatted} label="Время чтения" />

          <div className="my-8 p-6 bg-gray-50 rounded-xl">
            {text.title && (
              <h2 className="text-large font-semibold mb-4 text-center">{text.title}</h2>
            )}
            <p className="text-body leading-relaxed text-gray-800">
              {text.content}
            </p>
          </div>

          <div className="text-center">
            <Button size="large" variant="success" onClick={handleDone}>
              ПРОЧИТАНО
            </Button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className="text-heading text-success mb-4">Отлично!</p>
          <p className="text-body">Время чтения: {timer.formatted}</p>
        </div>
      )}
    </Card>
  );
}
