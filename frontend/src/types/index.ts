export interface MathProblem {
  id: number;
  expression: string;
  answer: number;
}

export interface ArithmeticResponse {
  problems: MathProblem[];
  time_limit_seconds: number;
}

export interface ReadingText {
  id: number;
  title: string;
  content: string;
  word_count: number;
}

export interface StroopItem {
  id: number;
  word: string;
  display_color: string;
  correct_answer: string;
}

export interface StroopResponse {
  items: StroopItem[];
  time_limit_seconds: number;
}

export interface MemoryWordsResponse {
  words: string[];
  memorize_time_seconds: number;
  recall_time_seconds: number;
}

export interface ExerciseResult {
  exercise_type: string;
  score: number;
  time_seconds: number;
  correct_answers: number;
  total_questions: number;
  details?: Record<string, any>;
}

export interface SessionResults {
  counting?: { time_seconds: number };
  arithmetic?: ExerciseResult;
  reading?: { completed: boolean; time_seconds: number };
  stroop?: ExerciseResult;
  memory?: ExerciseResult;
}
