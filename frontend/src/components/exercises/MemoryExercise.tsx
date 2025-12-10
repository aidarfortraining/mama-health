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
        <p className="text-body">Загрузка...</p>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-heading text-center mb-4">Запоминание слов</h1>

      {phase === 'memorize' && (
        <>
          <p className="text-body text-center text-gray-600 mb-4">
            Запомните эти слова:
          </p>
          <Timer formatted={memorizeTimer.formatted} label="Осталось времени" />

          <div className="my-6 p-6 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-3 gap-4">
              {words.map((word, idx) => (
                <p key={idx} className="text-large text-center font-medium">
                  {word}
                </p>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => {
              memorizeTimer.stop();
              setPhase('recall');
              recallTimer.start();
            }}>
              Я запомнил(а)
            </Button>
          </div>
        </>
      )}

      {phase === 'recall' && (
        <>
          <p className="text-body text-center text-gray-600 mb-4">
            Введите слова, которые запомнили:
          </p>
          <Timer formatted={recallTimer.formatted} label="Осталось времени" />

          <div className="my-6">
            <div className="flex gap-3">
              <input
                type="text"
                className="input-large flex-1"
                placeholder="Введите слово..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleAddWord}>
                Добавить
              </Button>
            </div>
          </div>

          {enteredWords.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl mb-6">
              <p className="text-small text-gray-600 mb-2">Введённые слова:</p>
              <div className="flex flex-wrap gap-2">
                {enteredWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary text-white rounded-full text-small"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button variant="success" size="large" onClick={finishExercise}>
              Завершить
            </Button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center">
          <p className="text-heading text-success mb-4">Отлично!</p>
          <p className="text-body mb-4">
            Вы вспомнили: {correctWords.length} из {words.length} слов
          </p>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-small text-gray-600 mb-2">Правильные слова:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={`px-4 py-2 rounded-full text-small ${
                    correctWords.includes(word.toLowerCase())
                      ? 'bg-success text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
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
