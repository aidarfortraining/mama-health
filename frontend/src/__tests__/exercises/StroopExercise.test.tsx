import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StroopExercise } from '../../components/exercises/StroopExercise';
import { api } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
    api: {
        getStroopTest: vi.fn(),
    },
}));

// Mock useTimer hook
vi.mock('../../hooks/useTimer', () => ({
    useTimer: () => ({
        seconds: 120,
        isRunning: true,
        formatted: '02:00',
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
    }),
}));

describe('StroopExercise', () => {
    const mockStroopData = {
        items: [
            { id: 1, word: 'КРАСНЫЙ', display_color: '#0000FF', correct_answer: 'синий' },
            { id: 2, word: 'СИНИЙ', display_color: '#008000', correct_answer: 'зелёный' },
            { id: 3, word: 'ЗЕЛЁНЫЙ', display_color: '#FF0000', correct_answer: 'красный' },
        ],
        time_limit_seconds: 120,
    };

    beforeEach(() => {
        vi.mocked(api.getStroopTest).mockResolvedValue(mockStroopData);
    });

    it('shows loading state initially', async () => {
        render(<StroopExercise onComplete={vi.fn()} />);
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
        await waitFor(() => {
            expect(api.getStroopTest).toHaveBeenCalled();
        });
    });

    it('displays word with different color (Stroop effect)', async () => {
        render(<StroopExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            const wordElement = screen.getByText('КРАСНЫЙ');
            // Word "КРАСНЫЙ" should be displayed in blue color (#0000FF), not red
            expect(wordElement).toHaveStyle({ color: '#0000FF' });
        });
    });

    it('shows all color options', async () => {
        render(<StroopExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('красный')).toBeInTheDocument();
            expect(screen.getByText('синий')).toBeInTheDocument();
            expect(screen.getByText('зелёный')).toBeInTheDocument();
            expect(screen.getByText('жёлтый')).toBeInTheDocument();
        });
    });

    it('displays instruction text', async () => {
        render(<StroopExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText(/ЦВЕТ букв/)).toBeInTheDocument();
        });
    });

    it('ensures word text differs from display color', async () => {
        render(<StroopExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            // Word is "КРАСНЫЙ" (red in Russian) but displayed in blue (#0000FF)
            // This validates the Stroop effect is working
            const wordElement = screen.getByText('КРАСНЫЙ');
            expect(wordElement).toBeInTheDocument();
            expect(wordElement.style.color).not.toBe('#FF0000'); // Should NOT be red
        });
    });
});
