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
        <div className="py-8">
          <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Загрузка текста...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          📖 Чтение вслух
        </h1>
      </div>

      {phase === 'ready' && (
        <div className="text-center animate-fade-in">
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-100 shadow-md">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed font-medium mb-4">
              Прочитайте следующий текст вслух, чётко и внятно
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-green-200">
              <span className="text-2xl">📄</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Количество слов</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {text.word_count}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Button size="large" onClick={handleStart} className="w-full sm:w-auto">
              <span className="text-2xl md:text-3xl">▶️</span>
              <span>НАЧАТЬ ЧТЕНИЕ</span>
            </Button>
          </div>
        </div>
      )}

      {phase === 'reading' && (
        <div className="animate-fade-in">
          <div className="mb-8">
            <Timer formatted={timer.formatted} label="Время чтения" />
          </div>

          <div className="my-6 md:my-8 p-5 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl shadow-lg border-2 border-gray-200">
            {text.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900 pb-4 border-b-2 border-gray-300">
                {text.title}
              </h2>
            )}
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-800 whitespace-pre-line">
              {text.content}
            </p>
          </div>

          <div className="text-center">
            <Button size="large" variant="success" onClick={handleDone} className="w-full sm:w-auto">
              <span className="text-2xl md:text-3xl">✓</span>
              <span>ПРОЧИТАНО</span>
            </Button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center animate-fade-in">
          <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-bounce-in">🎉</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-success font-bold mb-6">Отлично!</h2>
          <div className="inline-block px-8 py-5 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg border-2 border-green-100">
            <p className="text-sm sm:text-base text-gray-600 mb-2 font-medium">Время чтения:</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              {timer.formatted}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
