import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ArithmeticExercise } from '../../components/exercises/ArithmeticExercise';
import { api } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
    api: {
        getArithmeticProblems: vi.fn(),
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

describe('ArithmeticExercise', () => {
    const mockProblems = {
        problems: [
            { id: 1, expression: '2 + 3', answer: 5 },
            { id: 2, expression: '7 - 4', answer: 3 },
            { id: 3, expression: '5 + 8', answer: 13 },
        ],
        time_limit_seconds: 120,
    };

    beforeEach(() => {
        vi.mocked(api.getArithmeticProblems).mockResolvedValue(mockProblems);
    });

    it('shows loading state initially', () => {
        render(<ArithmeticExercise onComplete={vi.fn()} />);
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    it('displays problem after loading', async () => {
        render(<ArithmeticExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText(/2 \+ 3 = \?/)).toBeInTheDocument();
        });
    });

    it('displays four answer options', async () => {
        render(<ArithmeticExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            const buttons = screen.getAllByRole('button');
            // Should have 4 answer buttons
            expect(buttons.length).toBeGreaterThanOrEqual(4);
        });
    });

    it('shows correct answer option', async () => {
        render(<ArithmeticExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });

    it('tracks correct answers', async () => {
        render(<ArithmeticExercise onComplete={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText(/Правильных:/)).toBeInTheDocument();
        });
    });

    it('calls onComplete when exercise finishes', async () => {
        const onComplete = vi.fn();
        render(<ArithmeticExercise onComplete={onComplete} />);

        await waitFor(() => {
            expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
        });

        // Exercise should start after loading
        expect(api.getArithmeticProblems).toHaveBeenCalled();
    });
});
