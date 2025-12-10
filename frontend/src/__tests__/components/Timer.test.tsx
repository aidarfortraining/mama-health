import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from '../../components/common/Timer';

describe('Timer', () => {
    it('displays formatted time', () => {
        render(<Timer formatted="01:30" />);
        expect(screen.getByText('01:30')).toBeInTheDocument();
    });

    it('displays label when provided', () => {
        render(<Timer formatted="02:00" label="Осталось времени" />);
        expect(screen.getByText('Осталось времени')).toBeInTheDocument();
    });

    it('applies warning styles when isWarning is true', () => {
        const { container } = render(<Timer formatted="00:15" isWarning={true} />);
        const timerDisplay = container.querySelector('.text-display');
        expect(timerDisplay).toHaveClass('text-danger');
    });

    it('applies normal styles when isWarning is false', () => {
        const { container } = render(<Timer formatted="01:00" isWarning={false} />);
        const timerDisplay = container.querySelector('.text-display');
        expect(timerDisplay).not.toHaveClass('text-danger');
    });
});
