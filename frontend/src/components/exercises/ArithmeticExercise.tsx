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

  const timer = useTimer({
    initialSeconds: 120,
    onComplete: () => finishExercise(),
    autoStart: false,
  });

  useEffect(() => {
    api.getArithmeticProblems().then(data => {
      setProblems(data.problems);
      setLoading(false);
      timer.start();
    });
  }, []);

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

  const generateOptions = (correct: number): number[] => {
    const options = [correct];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const variant = correct + (Math.random() > 0.5 ? offset : -offset);
      if (variant > 0 && !options.includes(variant)) {
        options.push(variant);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <p className="text-body">Загрузка...</p>
      </Card>
    );
  }

  const currentProblem = problems[currentIndex];
  const options = generateOptions(currentProblem.answer);

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
        {options.map((option, idx) => (
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
