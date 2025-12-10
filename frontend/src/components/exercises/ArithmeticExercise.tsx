import { useState, useEffect } from 'react';
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
  const [currentOptions, setCurrentOptions] = useState<number[]>([]);

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
  }, []);

  // Генерируем варианты ответов при смене вопроса
  useEffect(() => {
    if (problems.length > 0 && currentIndex < problems.length) {
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

      setCurrentOptions(finalOptions);
    }
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
        <p className="text-body">Загрузка...</p>
      </Card>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-heading mb-4">Арифметика</h1>
        <ProgressBar
          current={currentIndex + 1}
          total={problems.length}
          label="Пример"
        />
      </div>

      <Timer
        formatted={timer.formatted}
        isWarning={timer.seconds < 30}
      />

      <div className="my-8 text-center">
        <p className="text-display">
          {currentProblem.expression} = ?
        </p>
      </div>

      <div
        className={`grid grid-cols-2 gap-4 transition-all ${
          feedback === 'correct' ? 'bg-green-100' :
          feedback === 'wrong' ? 'bg-red-100' : ''
        } rounded-xl p-4`}
      >
        {currentOptions.map((option, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="large"
            onClick={() => handleAnswer(option)}
            className="text-heading"
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-body text-gray-600">
          Правильных: <span className="text-success font-bold">{correctCount}</span>
        </p>
      </div>
    </Card>
  );
}
