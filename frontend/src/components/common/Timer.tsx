interface TimerProps {
  formatted: string;
  isWarning?: boolean;
  label?: string;
}

export function Timer({ formatted, isWarning = false, label }: TimerProps) {
  return (
    <div className="text-center">
      {label && (
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 font-semibold tracking-wide">
          {label}
        </p>
      )}
      <div
        className={`
          inline-flex items-center justify-center
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl
          font-mono font-bold
          px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5
          rounded-2xl
          transition-all duration-300
          shadow-md
          min-w-[200px] sm:min-w-[240px] md:min-w-[280px]
          ${isWarning
            ? 'text-danger bg-gradient-to-br from-red-50 to-red-100 animate-pulse shadow-xl border-2 border-red-200 scale-105'
            : 'text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
          }
        `}
        role="timer"
        aria-live="polite"
        aria-label={`${label || 'Время'}: ${formatted}`}
      >
        <svg
          className={`w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 ${isWarning ? 'text-danger animate-pulse' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formatted}
      </div>
    </div>
  );
}
