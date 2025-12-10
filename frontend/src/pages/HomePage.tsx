import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const exercises = [
  { id: 'counting', name: 'Счёт вслух', icon: '🔢', desc: 'Считайте от 1 до 120' },
  { id: 'arithmetic', name: 'Арифметика', icon: '➕', desc: '100 простых примеров' },
  { id: 'reading', name: 'Чтение вслух', icon: '📖', desc: 'Прочитайте текст' },
  { id: 'stroop', name: 'Тест Струпа', icon: '🎨', desc: 'Назовите цвет букв' },
  { id: 'memory', name: 'Память', icon: '🧠', desc: 'Запомните слова' },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-display text-gray-800 mb-4">
            Тренировка мозга
          </h1>
          <p className="text-body text-gray-600">
            Ежедневные упражнения для улучшения памяти и внимания
          </p>
        </div>

        <div className="mb-8">
          <Button
            size="large"
            className="w-full text-heading"
            onClick={() => navigate('/exercise/counting')}
          >
            Начать полную тренировку
          </Button>
        </div>

        <p className="text-large text-center text-gray-600 mb-6">
          Или выберите упражнение:
        </p>

        <div className="grid gap-4">
          {exercises.map(ex => (
            <Card
              key={ex.id}
              className="cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/exercise/${ex.id}`)}
            >
              <div className="flex items-center gap-6">
                <span className="text-display">{ex.icon}</span>
                <div>
                  <h2 className="text-large font-semibold">{ex.name}</h2>
                  <p className="text-body text-gray-600">{ex.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
