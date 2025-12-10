import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  size?: 'normal' | 'large';
}

export function Button({
  children,
  variant = 'primary',
  size = 'normal',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline',
  };

  const sizes = {
    normal: '',
    large: 'btn-large',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
