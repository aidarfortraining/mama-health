import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = '', interactive = false, ...props }: CardProps) {
  const interactiveClass = interactive ? 'card-interactive' : '';

  return (
    <div
      className={`card ${interactiveClass} ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
