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
        <p className="text-body">Загрузка...</p>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <h1 className="text-heading text-success mb-4">Отлично!</h1>
        <p className="text-body">Правильных ответов: {correctCount} из {items.length}</p>
        <p className="text-small text-gray-500 mt-4">Переход к следующему упражнению...</p>
      </Card>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-heading mb-2">Тест Струпа</h1>
        <p className="text-body text-gray-600 mb-4">
          Назовите <strong>ЦВЕТ букв</strong>, не читайте слово!
        </p>
        <ProgressBar current={currentIndex + 1} total={items.length} />
      </div>

      <Timer formatted={timer.formatted} isWarning={timer.seconds < 30} />

      <div
        className={`my-8 p-8 rounded-xl text-center transition-all ${
          feedback === 'correct' ? 'bg-green-100' :
          feedback === 'wrong' ? 'bg-red-100' : 'bg-gray-50'
        }`}
      >
        <p
          className="text-display font-bold"
          style={{ color: currentItem.display_color }}
        >
          {currentItem.word}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COLOR_OPTIONS.map(color => (
          <Button
            key={color}
            variant="outline"
            onClick={() => handleAnswer(color)}
            className="text-large capitalize"
          >
            {color}
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
