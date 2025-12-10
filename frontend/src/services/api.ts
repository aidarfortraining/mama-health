import type { ArithmeticResponse, ReadingText, StroopResponse, MemoryWordsResponse, ExerciseResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async getArithmeticProblems(): Promise<ArithmeticResponse> {
    const res = await fetch(`${API_URL}/api/exercises/arithmetic`);
    if (!res.ok) throw new Error('Failed to fetch arithmetic problems');
    return res.json();
  },

  async getReadingText(): Promise<ReadingText> {
    const res = await fetch(`${API_URL}/api/exercises/reading`);
    if (!res.ok) throw new Error('Failed to fetch reading text');
    return res.json();
  },

  async getStroopTest(): Promise<StroopResponse> {
    const res = await fetch(`${API_URL}/api/exercises/stroop`);
    if (!res.ok) throw new Error('Failed to fetch stroop test');
    return res.json();
  },

  async getMemoryWords(): Promise<MemoryWordsResponse> {
    const res = await fetch(`${API_URL}/api/exercises/memory-words`);
    if (!res.ok) throw new Error('Failed to fetch memory words');
    return res.json();
  },

  async saveResult(data: ExerciseResult): Promise<void> {
    const res = await fetch(`${API_URL}/api/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save result');
  },
};
