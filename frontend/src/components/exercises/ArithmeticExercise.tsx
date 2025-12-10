import { useState, useEffect, useMemo } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Timer } from '../common/Timer';
import { ProgressBar } from '../common/ProgressBar';
import { Card } from '../common/Card';
import type { MathProblem, ExerciseResult } from '../../types';

interface ArithmeticExerciseProps {
  onComplete: (result: ExerciseResult) => void;
}

export function ArithmeticExercise({ onComplete }: ArithmeticExerciseProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timer = useTimer({
    initialSeconds: 120,
    onComplete: () => finishExercise(),
    autoStart: false,
  });

  useEffect(() => {
    api.getArithmeticProblems().then(data => {
      // Берем только первые 50 проблем
      setProblems(data.problems.slice(0, 50));
      setLoading(false);
      timer.start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Генерируем варианты ответов при смене вопроса
  const currentOptions = useMemo(() => {
    if (problems.length === 0 || currentIndex >= problems.length) {
      return [];
    }

    const correct = problems[currentIndex].answer;
    const options = [correct];

    // Генерируем 3 неправильных варианта
    const offsets = [1, 2, 3];
    for (const offset of offsets) {
      const variant = correct + (offset % 2 === 0 ? offset : -offset);
      if (variant > 0) {
        options.push(variant);
      } else {
        options.push(correct + offset);
      }
    }

    // Убедимся что есть ровно 4 варианта
    const finalOptions = options.slice(0, 4);
    if (!finalOptions.includes(correct)) {
      finalOptions[0] = correct;
    }

    // Перемешиваем варианты (Fisher-Yates shuffle)
    for (let i = finalOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }

    return finalOptions;
  }, [currentIndex, problems]);

  const finishExercise = () => {
    timer.stop();
    onComplete({
      exercise_type: 'arithmetic',
      score: correctCount,
      time_seconds: 120 - timer.seconds,
      correct_answers: correctCount,
      total_questions: problems.length,
    });
  };

  const handleAnswer = (answer: number) => {
    const correct = problems[currentIndex].answer === answer;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishExercise();
      }
    }, 300);
  };

  if (loading || currentOptions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <div className="py-8">
          <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Загрузка упражнения...</p>
        </div>
      </Card>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ➕ Арифметика
        </h1>
        <ProgressBar
          current={currentIndex + 1}
          total={problems.length}
          label="Пример"
        />
      </div>

      <div className="mb-4 md:mb-6">
        <Timer
          formatted={timer.formatted}
          isWarning={timer.seconds < 30}
        />
      </div>

      {/* Problem display */}
      <div className="my-6 md:my-8 text-center">
        <div className="inline-block bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-4 sm:px-8 sm:py-6 rounded-2xl shadow-md border-2 border-blue-100">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            {currentProblem.expression} = ?
          </p>
        </div>
      </div>

      {/* Answer options with feedback animation */}
      <div
        className={`
          grid grid-cols-2 gap-3 sm:gap-4
          transition-all duration-300
          rounded-2xl p-3 sm:p-4 md:p-5
          ${feedback === 'correct'
            ? 'bg-gradient-to-br from-green-50 to-green-100 shadow-lg animate-bounce-in'
            : feedback === 'wrong'
            ? 'bg-gradient-to-br from-red-50 to-red-100 animate-shake'
            : 'bg-transparent'}
        `}
      >
        {currentOptions.map((option, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="large"
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold hover:scale-105 active:scale-95 transition-all min-h-[72px] sm:min-h-[80px]"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Visual feedback indicator */}
      {feedback && (
        <div className="mt-4 text-center animate-fade-in">
          {feedback === 'correct' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-full shadow-lg">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">Правильно!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-full shadow-lg">
              <span className="text-2xl">✗</span>
              <span className="font-semibold">Неверно</span>
            </div>
          )}
        </div>
      )}

      {/* Stats display */}
      <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Правильных</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-success">{correctCount}</p>
        </div>
        <div className="h-10 sm:h-12 w-px bg-gray-300" />
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Осталось</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700">
            {problems.length - currentIndex - 1}
          </p>
        </div>
      </div>
    </Card>
  );
}
