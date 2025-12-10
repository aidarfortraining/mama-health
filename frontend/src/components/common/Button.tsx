import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'normal' | 'large';
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
    small: 'btn-small',
    normal: '',
    large: 'btn-large',
  };

  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
