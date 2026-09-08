import { useMemo } from 'react';
import { DAY_LABELS, formatDayDate } from '../lib/date';
import TaskItem from './TaskItem';
import InlineAddRow from './InlineAddRow';

export default function DayCard({
  weekKey,
  dayIndex,
  tasks,
  isToday,
  onAdd,
  onToggle,
  onChangeText,
  onDelete,
  addRowRef,
}) {
  const sorted = useMemo(() => [...tasks].sort((a, b) => Number(a.done) - Number(b.done)), [tasks]);

  return (
    <div
      className={`panel flex flex-col h-full min-h-[220px] p-3.5 transition-shadow hover:shadow-card-hover ${
        isToday ? 'border-sage/50 shadow-[0_0_0_1px_rgba(63,164,122,0.25)]' : ''
      }`}
    >
      <div className="flex items-baseline justify-between mb-2 pb-2 border-b border-border">
        <span className={`font-display font-semibold text-[13px] tracking-wide ${isToday ? 'text-sage' : 'text-ink'}`}>
          {DAY_LABELS[dayIndex]}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          {isToday && <span className="w-1.5 h-1.5 rounded-full bg-sage" />}
          {formatDayDate(weekKey, dayIndex)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[220px]">
        {sorted.map((t) => (
          <TaskItem
            key={t.id}
            text={t.text}
            done={t.done}
            accent="sage"
            onToggle={() => onToggle(t.id)}
            onChangeText={(text) => onChangeText(t.id, text)}
            onDelete={() => onDelete(t.id)}
          />
        ))}
      </div>

      <div className="pt-1 mt-1 border-t border-border/70">
        <InlineAddRow ref={addRowRef} placeholder="Add task…" accent="sage" onAdd={onAdd} />
      </div>
    </div>
  );
}
