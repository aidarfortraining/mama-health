import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../../components/common/ProgressBar';

describe('ProgressBar', () => {
    it('displays current and total values with label', () => {
        render(<ProgressBar current={5} total={10} label="Пример" />);
        expect(screen.getByText('Пример: 5 из 10')).toBeInTheDocument();
    });

    it('displays label when provided', () => {
        render(<ProgressBar current={3} total={100} label="Пример" />);
        expect(screen.getByText(/Пример/)).toBeInTheDocument();
    });

    it('calculates correct progress percentage', () => {
        const { container } = render(<ProgressBar current={25} total={100} />);
        const progressFill = container.querySelector('.bg-primary');
        expect(progressFill).toHaveStyle({ width: '25%' });
    });

    it('shows 100% when current equals total', () => {
        const { container } = render(<ProgressBar current={50} total={50} />);
        const progressFill = container.querySelector('.bg-primary');
        expect(progressFill).toHaveStyle({ width: '100%' });
    });

    it('shows 0% when current is 0', () => {
        const { container } = render(<ProgressBar current={0} total={100} />);
        const progressFill = container.querySelector('.bg-primary');
        expect(progressFill).toHaveStyle({ width: '0%' });
    });

    it('renders without crashing with valid props', () => {
        const { container } = render(<ProgressBar current={1} total={10} />);
        expect(container.querySelector('.bg-primary')).toBeInTheDocument();
    });
});
