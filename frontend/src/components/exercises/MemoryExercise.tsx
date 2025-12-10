import { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Timer } from '../common/Timer';
import { Card } from '../common/Card';
import type { ExerciseResult } from '../../types';

interface MemoryExerciseProps {
  onComplete: (result: ExerciseResult) => void;
}

export function MemoryExercise({ onComplete }: MemoryExerciseProps) {
  const [words, setWords] = useState<string[]>([]);
  const [phase, setPhase] = useState<'loading' | 'memorize' | 'recall' | 'done'>('loading');
  const [inputValue, setInputValue] = useState('');
  const [enteredWords, setEnteredWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);

  const memorizeTimer = useTimer({
    initialSeconds: 60,
    onComplete: () => setPhase('recall'),
  });

  const recallTimer = useTimer({
    initialSeconds: 120,
    onComplete: () => finishExercise(),
  });

  useEffect(() => {
    api.getMemoryWords().then(data => {
      setWords(data.words);
      setPhase('memorize');
      memorizeTimer.start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishExercise = () => {
    recallTimer.stop();
    const correct = enteredWords.filter(w =>
      words.map(x => x.toLowerCase()).includes(w.toLowerCase())
    );
    setCorrectWords(correct);
    setPhase('done');

    onComplete({
      exercise_type: 'memory',
      score: correct.length,
      time_seconds: 120 - recallTimer.seconds,
      correct_answers: correct.length,
      total_questions: words.length,
    });
  };

  const handleAddWord = () => {
    const word = inputValue.trim().toLowerCase();
    if (word && !enteredWords.includes(word)) {
      setEnteredWords(prev => [...prev, word]);
    }
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddWord();
    }
  };

  if (phase === 'loading') {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <div className="py-8">
          <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Загрузка слов...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          🧠 Память
        </h1>
      </div>

      {phase === 'memorize' && (
        <div className="animate-fade-in">
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 mb-6 font-medium">
            Запомните эти <span className="text-primary font-bold">{words.length} слов</span>
          </p>

          <div className="mb-6">
            <Timer
              formatted={memorizeTimer.formatted}
              label="Время на запоминание"
              isWarning={memorizeTimer.seconds < 15}
            />
          </div>

          <div className="my-6 md:my-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-inner border-2 border-purple-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {words.map((word, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 bg-white rounded-xl shadow-sm text-center transform hover:scale-105 transition-transform"
                >
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                    {word}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                memorizeTimer.stop();
                setPhase('recall');
                recallTimer.start();
              }}
            >
              <span className="text-xl">✓</span>
              <span>Я запомнил(а)</span>
            </Button>
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div className="animate-fade-in">
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 mb-6 font-medium">
            Введите слова, которые <span className="text-primary font-bold">запомнили</span>
          </p>

          <div className="mb-6">
            <Timer
              formatted={recallTimer.formatted}
              label="Время на ввод"
              isWarning={recallTimer.seconds < 30}
            />
          </div>

          <div className="my-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="input-large flex-1 min-h-[56px]"
                placeholder="Введите слово..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <Button
                onClick={handleAddWord}
                size="large"
                className="whitespace-nowrap min-w-[140px]"
                disabled={!inputValue.trim()}
              >
                <span className="text-lg">➕</span>
                <span>Добавить</span>
              </Button>
            </div>
          </div>

          {enteredWords.length > 0 && (
            <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl mb-6 shadow-inner border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm sm:text-base text-gray-700 font-semibold">
                  Введённые слова:
                </p>
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-bold">
                  {enteredWords.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {enteredWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary text-white rounded-full text-sm sm:text-base font-medium shadow-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="success"
              size="large"
              onClick={finishExercise}
            >
              <span className="text-xl">✓</span>
              <span>Завершить</span>
            </Button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="text-center animate-fade-in">
          <div className="text-5xl sm:text-6xl md:text-7xl mb-6">🎉</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-success font-bold mb-6">
            Отлично!
          </h2>
          <div className="inline-block px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl mb-8 shadow-md border-2 border-green-100">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold">
              Вы вспомнили: <span className="text-success text-2xl sm:text-3xl md:text-4xl font-bold">{correctWords.length}</span> из {words.length} слов
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-inner">
            <p className="text-sm sm:text-base text-gray-600 mb-4 font-medium">Все слова:</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={`
                    px-4 py-2 rounded-full text-sm sm:text-base font-medium
                    transform transition-all duration-200 shadow-sm
                    ${correctWords.includes(word.toLowerCase())
                      ? 'bg-success text-white scale-105'
                      : 'bg-gray-300 text-gray-600'
                    }
                  `}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
