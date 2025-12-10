import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import type { SessionResults } from '../types';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results as SessionResults || {};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-display mb-4">Тренировка завершена!</h1>
            <p className="text-body text-gray-600">Ваши результаты:</p>
          </div>

          <div className="space-y-4 mb-8">
            {results.counting && (
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-large">Счёт вслух</span>
                <span className="text-large font-bold">{formatTime(results.counting.time_seconds)}</span>
              </div>
            )}

            {results.arithmetic && (
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-large">Арифметика</span>
                <span className="text-large font-bold text-success">
                  {results.arithmetic.correct_answers} / {results.arithmetic.total_questions}
                </span>
              </div>
            )}

            {results.reading && (
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-large">Чтение</span>
                <span className="text-large font-bold text-success">✓</span>
              </div>
            )}

            {results.stroop && (
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-large">Тест Струпа</span>
                <span className="text-large font-bold text-success">
                  {results.stroop.correct_answers} / {results.stroop.total_questions}
                </span>
              </div>
            )}

            {results.memory && (
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-large">Память</span>
                <span className="text-large font-bold text-success">
                  {results.memory.correct_answers} / {results.memory.total_questions}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
              Главная
            </Button>
            <Button className="flex-1" onClick={() => navigate('/exercise/counting')}>
              Ещё раз
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
