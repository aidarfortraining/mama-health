interface TimerProps {
  formatted: string;
  isWarning?: boolean;
  label?: string;
}

export function Timer({ formatted, isWarning = false, label }: TimerProps) {
  return (
    <div className="text-center">
      {label && <p className="text-small text-gray-600 mb-1">{label}</p>}
      <div className={`text-display font-mono ${isWarning ? 'text-danger' : 'text-gray-800'}`}>
        {formatted}
      </div>
    </div>
  );
}
