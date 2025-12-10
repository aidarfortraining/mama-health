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
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg md:text-xl text-gray-900 font-bold tabular-nums">
              {current}
            </span>
            <span className="text-sm sm:text-base text-gray-500">/</span>
            <span className="text-sm sm:text-base md:text-lg text-gray-600 font-medium tabular-nums">
              {total}
            </span>
          </div>
        </div>
      )}
      <div className="relative w-full bg-gray-200 rounded-full h-4 sm:h-5 md:h-6 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Прогресс: ${current} из ${total}`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
        </div>
        {/* Percentage text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-gray-700 drop-shadow-sm">
            {percentage}%
          </span>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
