# Brain Training Frontend

React 19 + TypeScript SPA для когнитивных тренировок.

## Технологии

- React 19 + TypeScript
- Vite 7
- TailwindCSS 4
- React Router v7
- Axios

## Команды

```bash
npm install      # Установка
npm run dev      # Dev-сервер (localhost:5173)
npm run build    # Production сборка
npm test         # Тесты (47 тестов)
npm run lint     # ESLint
```

## Структура

```
src/
├── components/
│   ├── common/        # Button, Timer, ProgressBar, Card
│   └── exercises/     # 5 компонентов упражнений
├── pages/             # HomePage, ExercisePage, ResultsPage
├── hooks/             # useTimer
├── services/          # API клиент
└── __tests__/         # Тесты
```

## .env

```
VITE_API_URL=http://localhost:8000
```
