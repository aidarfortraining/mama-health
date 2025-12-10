import { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Timer } from '../common/Timer';
import { ProgressBar } from '../common/ProgressBar';
import { Card } from '../common/Card';
import type { StroopItem, ExerciseResult } from '../../types';

interface StroopExerciseProps {
  onComplete: (result: ExerciseResult) => void;
}

const COLOR_OPTIONS = ['красный', 'синий', 'зелёный', 'жёлтый', 'чёрный'];

export function StroopExercise({ onComplete }: StroopExerciseProps) {
  const [items, setItems] = useState<StroopItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timer = useTimer({
    initialSeconds: 120,
    onComplete: () => finishExercise(),
    autoStart: false,
  });

  useEffect(() => {
    api.getStroopTest().then(data => {
      setItems(data.items);
      setLoading(false);
      timer.start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishExercise = () => {
    timer.stop();
    setFinished(true);
    onComplete({
      exercise_type: 'stroop',
      score: correctCount,
      time_seconds: 120 - timer.seconds,
      correct_answers: correctCount,
      total_questions: items.length,
    });
  };

  const handleAnswer = (color: string) => {
    const correct = items[currentIndex].correct_answer === color;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishExercise();
      }
    }, 400);
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <div className="py-8">
          <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Загрузка теста...</p>
        </div>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="text-5xl sm:text-6xl md:text-7xl mb-4">🎉</div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-success font-bold mb-4">Отлично!</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700">
          Правильных ответов: <span className="font-bold text-primary">{correctCount}</span> из {items.length}
        </p>
        <p className="text-sm sm:text-base text-gray-500 mt-4">Переход к следующему упражнению...</p>
      </Card>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🎨 Тест Струпа
        </h1>
        <div className="inline-block px-4 py-2 bg-pink-50 rounded-lg mb-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Назовите <strong className="text-danger">ЦВЕТ букв</strong>, не читайте слово!
          </p>
        </div>
        <ProgressBar current={currentIndex + 1} total={items.length} />
      </div>

      <div className="mb-4 md:mb-6">
        <Timer formatted={timer.formatted} isWarning={timer.seconds < 30} />
      </div>

      {/* Word display with visual feedback */}
      <div
        className={`
          my-6 md:my-8 p-8 sm:p-10 md:p-12 lg:p-16
          rounded-3xl text-center
          transition-all duration-300
          shadow-lg border-2
          ${feedback === 'correct'
            ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 scale-105 animate-bounce-in'
            : feedback === 'wrong'
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 scale-95 animate-shake'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}
        `}
      >
        <p
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold select-none drop-shadow-sm"
          style={{ color: currentItem.display_color }}
        >
          {currentItem.word.toUpperCase()}
        </p>
      </div>

      {/* Visual feedback indicator */}
      {feedback && (
        <div className="mb-4 text-center animate-fade-in">
          {feedback === 'correct' ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-success text-white rounded-full shadow-lg">
              <span className="text-2xl">✓</span>
              <span className="text-base sm:text-lg font-semibold">Правильно!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-danger text-white rounded-full shadow-lg">
              <span className="text-2xl">✗</span>
              <span className="text-base sm:text-lg font-semibold">Неверно</span>
            </div>
          )}
        </div>
      )}

      {/* Color options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {COLOR_OPTIONS.map(color => (
          <Button
            key={color}
            variant="outline"
            size="large"
            onClick={() => handleAnswer(color)}
            disabled={feedback !== null}
            className="text-base sm:text-lg md:text-xl lg:text-2xl capitalize font-semibold hover:scale-105 active:scale-95 transition-all min-h-[64px] sm:min-h-[72px]"
          >
            {color}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Правильных</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-success">{correctCount}</p>
        </div>
        <div className="h-10 sm:h-12 w-px bg-gray-300" />
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Осталось</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700">
            {items.length - currentIndex - 1}
          </p>
        </div>
      </div>
    </Card>
  );
}
