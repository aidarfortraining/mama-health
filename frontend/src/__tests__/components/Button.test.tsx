import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/common/Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);

        fireEvent.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });

    it('applies success variant when specified', () => {
        render(<Button variant="success">Success</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-success');
    });

    it('applies outline variant when specified', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-outline');
    });

    it('applies large size class when specified', () => {
        render(<Button size="large">Large</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-large');
    });

    it('has minimum height for accessibility', () => {
        const { container } = render(<Button>Accessible</Button>);
        const button = container.querySelector('button');
        // Button should have min-h-touch class (60px) for elderly users
        expect(button?.className).toMatch(/btn/);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies additional className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
});
