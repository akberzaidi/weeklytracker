import { formatWeekRange } from '../lib/date';

export default function WeekNavigator({ weekKey, isCurrentWeek, onPrev, onNext, onToday }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous week"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sage-tint text-muted hover:text-sage transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center gap-2 px-1">
        <span className="font-display font-semibold text-[16px] sm:text-[18px] text-ink whitespace-nowrap">
          Week of {formatWeekRange(weekKey)}
        </span>
        {!isCurrentWeek && (
          <button
            type="button"
            onClick={onToday}
            className="text-[11px] font-medium text-sage bg-sage-tint px-2 py-0.5 rounded-full hover:bg-sage/20 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next week"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sage-tint text-muted hover:text-sage transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
