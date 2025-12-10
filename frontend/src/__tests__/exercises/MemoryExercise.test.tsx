import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryExercise } from '../../components/exercises/MemoryExercise';
import { api } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
    api: {
        getMemoryWords: vi.fn(),
    },
}));

// Mock useTimer hook
vi.mock('../../hooks/useTimer', () => ({
    useTimer: () => ({
        seconds: 60,
        isRunning: true,
        formatted: '01:00',
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
    }),
}));

describe('MemoryExercise', () => {
    const mockMemoryData = {
        words: ['яблоко', 'стол', 'книга', 'солнце', 'река', 'дом', 'кот', 'сад', 'луна', 'море', 'лес', 'гора'],
        memorize_time_seconds: 60,
        recall_time_seconds: 120,
    };

    beforeEach(() => {
        vi.mocked(api.getMemoryWords).mockResolvedValue(mockMemoryData);
    });

    it('shows loading state initially', () => {
        render(<MemoryExercise onComplete={vi.fn()} />);
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    it('displays words in memorize phase', async () => {
        render(<MemoryExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('яблоко')).toBeInTheDocument();
            expect(screen.getByText('стол')).toBeInTheDocument();
        });
    });

    it('shows "Я запомнил(а)" button in memorize phase', async () => {
        render(<MemoryExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Я запомнил(а)')).toBeInTheDocument();
        });
    });

    it('displays all 12 words', async () => {
        render(<MemoryExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            mockMemoryData.words.forEach(word => {
                expect(screen.getByText(word)).toBeInTheDocument();
            });
        });
    });

    it('shows instruction text', async () => {
        render(<MemoryExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('Запомните эти слова:')).toBeInTheDocument();
        });
    });
});
