interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {label && (
        <p className="text-body text-center mb-2 text-gray-700">
          {label}: {current} из {total}
        </p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className="bg-primary h-6 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
