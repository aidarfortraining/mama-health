import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const exercises = [
  {
    id: 'counting',
    name: 'Счёт вслух',
    icon: '🔢',
    desc: 'Считайте от 1 до 120',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-700',
    time: '~2 мин'
  },
  {
    id: 'arithmetic',
    name: 'Арифметика',
    icon: '➕',
    desc: '50 простых примеров',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    textColor: 'text-purple-700',
    time: '2 мин'
  },
  {
    id: 'reading',
    name: 'Чтение вслух',
    icon: '📖',
    desc: 'Прочитайте текст',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    textColor: 'text-green-700',
    time: '~3 мин'
  },
  {
    id: 'stroop',
    name: 'Тест Струпа',
    icon: '🎨',
    desc: 'Назовите цвет букв',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-50 to-pink-100',
    textColor: 'text-pink-700',
    time: '2 мин'
  },
  {
    id: 'memory',
    name: 'Память',
    icon: '🧠',
    desc: 'Запомните слова',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    textColor: 'text-orange-700',
    time: '3 мин'
  },
];

export function HomePage() {
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/exercise/${id}`);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:p-6 md:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
            Тренировка мозга
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
            Ежедневные упражнения для улучшения памяти и внимания
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-8 md:mb-10">
          <Button
            size="large"
            className="w-full"
            onClick={() => navigate('/exercise/counting')}
          >
            <span className="text-lg md:text-xl lg:text-2xl">🚀</span>
            <span>Начать полную тренировку</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-medium">
            Или выберите упражнение
          </p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* Exercise Cards Grid - Mobile: 1 column, Tablet: 2 columns, Desktop: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {exercises.map(ex => (
            <Card
              key={ex.id}
              interactive
              onClick={() => navigate(`/exercise/${ex.id}`)}
              onKeyDown={(e) => handleKeyPress(e, ex.id)}
              className="group relative overflow-hidden"
            >
              {/* Gradient background overlay on hover */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${ex.bgColor}
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
              `} />

              <div className="relative flex items-center gap-4 sm:gap-5">
                {/* Icon with gradient background */}
                <div className={`
                  flex-shrink-0
                  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                  rounded-2xl sm:rounded-3xl
                  bg-gradient-to-br ${ex.color}
                  flex items-center justify-center
                  shadow-lg
                  transform transition-all duration-300
                  group-hover:scale-110 group-hover:rotate-6
                  group-active:scale-95
                `}>
                  <span className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow-sm">
                    {ex.icon}
                  </span>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                    {ex.name}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2">
                    {ex.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-xs sm:text-sm font-semibold ${ex.textColor}`}>
                      {ex.time}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 text-gray-400 group-hover:text-primary transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
