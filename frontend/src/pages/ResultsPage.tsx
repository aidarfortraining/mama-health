import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import type { SessionResults } from '../types';

const exerciseInfo = {
  counting: { name: 'Счёт вслух', icon: '🔢', color: 'from-blue-500 to-blue-600' },
  arithmetic: { name: 'Арифметика', icon: '➕', color: 'from-purple-500 to-purple-600' },
  reading: { name: 'Чтение вслух', icon: '📖', color: 'from-green-500 to-green-600' },
  stroop: { name: 'Тест Струпа', icon: '🎨', color: 'from-pink-500 to-pink-600' },
  memory: { name: 'Память', icon: '🧠', color: 'from-orange-500 to-orange-600' },
};

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results as SessionResults || {};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resultsCount = Object.keys(results).length;

  return (
    <div className="min-h-screen px-4 py-6 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Card>
          {/* Header with celebration */}
          <div className="text-center mb-8 md:mb-10">
            <div className="text-6xl md:text-7xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Отличная работа!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Вы завершили {resultsCount} {resultsCount === 1 ? 'упражнение' : 'упражнения'}
            </p>
          </div>

          {/* Results list */}
          <div className="space-y-3 sm:space-y-4 mb-8">
            {results.counting && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-between shadow-sm border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${exerciseInfo.counting.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xl sm:text-2xl">{exerciseInfo.counting.icon}</span>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    {exerciseInfo.counting.name}
                  </span>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  {formatTime(results.counting.time_seconds)}
                </span>
              </div>
            )}

            {results.arithmetic && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl flex items-center justify-between shadow-sm border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${exerciseInfo.arithmetic.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xl sm:text-2xl">{exerciseInfo.arithmetic.icon}</span>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    {exerciseInfo.arithmetic.name}
                  </span>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                  {results.arithmetic.correct_answers} / {results.arithmetic.total_questions}
                </span>
              </div>
            )}

            {results.reading && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl flex items-center justify-between shadow-sm border border-green-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${exerciseInfo.reading.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xl sm:text-2xl">{exerciseInfo.reading.icon}</span>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    {exerciseInfo.reading.name}
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl text-success">✓</span>
              </div>
            )}

            {results.stroop && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl flex items-center justify-between shadow-sm border border-pink-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${exerciseInfo.stroop.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xl sm:text-2xl">{exerciseInfo.stroop.icon}</span>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    {exerciseInfo.stroop.name}
                  </span>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                  {results.stroop.correct_answers} / {results.stroop.total_questions}
                </span>
              </div>
            )}

            {results.memory && (
              <div className="p-4 md:p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl flex items-center justify-between shadow-sm border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${exerciseInfo.memory.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xl sm:text-2xl">{exerciseInfo.memory.icon}</span>
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium text-gray-800">
                    {exerciseInfo.memory.name}
                  </span>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                  {results.memory.correct_answers} / {results.memory.total_questions}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="flex-1 order-2 sm:order-1"
              onClick={() => navigate('/')}
            >
              Главная
            </Button>
            <Button
              className="flex-1 order-1 sm:order-2"
              onClick={() => navigate('/exercise/counting')}
            >
              <span>🔄</span>
              <span>Ещё раз</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
