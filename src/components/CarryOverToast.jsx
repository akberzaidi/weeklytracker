export default function CarryOverToast({ count, onApply, onDismiss }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up no-print px-4">
      <div className="panel flex items-center gap-3 px-4 py-2.5 shadow-card-hover">
        <span className="text-[13px] text-ink whitespace-nowrap">
          Carry over {count} unfinished {count === 1 ? 'task' : 'tasks'} from last week?
        </span>
        <button
          type="button"
          onClick={onApply}
          className="text-[12px] font-medium text-white bg-sage px-3 py-1 rounded-full hover:bg-sage/90 transition-colors whitespace-nowrap"
        >
          Carry over
        </button>
        <button type="button" onClick={onDismiss} className="text-[12px] text-muted hover:text-ink px-1">
          Dismiss
        </button>
      </div>
    </div>
  );
}
