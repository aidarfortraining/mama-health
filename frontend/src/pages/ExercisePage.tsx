import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CountingExercise } from '../components/exercises/CountingExercise';
import { ArithmeticExercise } from '../components/exercises/ArithmeticExercise';
import { ReadingExercise } from '../components/exercises/ReadingExercise';
import { StroopExercise } from '../components/exercises/StroopExercise';
import { MemoryExercise } from '../components/exercises/MemoryExercise';
import { Button } from '../components/common/Button';
import type { SessionResults } from '../types';

const exerciseOrder = ['counting', 'arithmetic', 'reading', 'stroop', 'memory'];

export function ExercisePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<SessionResults>({});
  const [currentExercise, setCurrentExercise] = useState(type || 'counting');

  const handleComplete = (exerciseType: string, result: any) => {
    setResults(prev => ({ ...prev, [exerciseType]: result }));

    const currentIndex = exerciseOrder.indexOf(exerciseType);
    if (currentIndex < exerciseOrder.length - 1) {
      const nextExercise = exerciseOrder[currentIndex + 1];
      setTimeout(() => {
        setCurrentExercise(nextExercise);
        // Меняем URL при переходе к следующему упражнению
        navigate(`/exercise/${nextExercise}`, { replace: true });
      }, 2000);
    } else {
      navigate('/results', { state: { results: { ...results, [exerciseType]: result } } });
    }
  };

  const renderExercise = () => {
    switch (currentExercise) {
      case 'counting':
        return <CountingExercise onComplete={(r) => handleComplete('counting', r)} />;
      case 'arithmetic':
        return <ArithmeticExercise onComplete={(r) => handleComplete('arithmetic', r)} />;
      case 'reading':
        return <ReadingExercise onComplete={(r) => handleComplete('reading', r)} />;
      case 'stroop':
        return <StroopExercise onComplete={(r) => handleComplete('stroop', r)} />;
      case 'memory':
        return <MemoryExercise onComplete={(r) => handleComplete('memory', r)} />;
      default:
        return <p>Упражнение не найдено</p>;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Назад
          </Button>
        </div>
        {renderExercise()}
      </div>
    </div>
  );
}
