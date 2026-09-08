import { useMemo } from 'react';
import { HABIT_DAY_LABELS } from '../lib/date';
import InlineAddRow from './InlineAddRow';
import SectionLabel from './SectionLabel';

function HabitCell({ active, isToday, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`w-6 h-6 rounded-full border-[1.5px] transition-transform duration-100 active:scale-90 ${
        active ? 'bg-sky border-sky' : 'bg-white border-border hover:border-sky/50'
      } ${isToday ? 'ring-2 ring-sky/25 ring-offset-1' : ''}`}
    />
  );
}

export default function HabitTracker({
  habits,
  streaks,
  onAddHabit,
  onToggleDay,
  onUpdateGoal,
  onDeleteHabit,
  todayIndex,
  addRowRef,
}) {
  const totals = useMemo(() => {
    const perDay = Array(7).fill(0);
    habits.forEach((h) => h.days.forEach((v, i) => { if (v) perDay[i] += 1; }));
    return perDay;
  }, [habits]);

  return (
    <div className="panel p-4 sm:p-5 flex flex-col h-full">
      <SectionLabel>Habit Tracker</SectionLabel>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-[13px] border-collapse min-w-[400px]">
          <thead>
            <tr className="text-muted">
              <th className="text-left font-medium pb-2 pr-2">Habit</th>
              {HABIT_DAY_LABELS.map((d, i) => (
                <th key={i} className={`w-7 text-center font-medium pb-2 ${i === todayIndex ? 'text-sky' : ''}`}>
                  {d}
                </th>
              ))}
              <th className="text-center font-medium pb-2 px-1.5">Done</th>
              <th className="text-center font-medium pb-2 pl-1">Goal</th>
              <th className="w-4"></th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 && (
              <tr>
                <td colSpan={11} className="text-[13px] text-muted/70 py-1">
                  No habits yet — track up to a few things you want to keep up this week.
                </td>
              </tr>
            )}
            {habits.map((h) => {
              const achieved = h.days.filter(Boolean).length;
              const met = achieved >= h.goal;
              const streak = streaks[h.id] || 0;
              return (
                <tr key={h.id} className="group border-t border-border/70">
                  <td className="py-1.5 pr-2 text-ink whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      {h.name}
                      {met && (
                        <span className="text-[11px]" title={`${streak}-week streak`}>
                          🔥{streak > 1 ? streak : ''}
                        </span>
                      )}
                    </span>
                  </td>
                  {h.days.map((v, i) => (
                    <td key={i} className="text-center py-1.5">
                      <div className="flex items-center justify-center">
                        <HabitCell active={v} isToday={i === todayIndex} onToggle={() => onToggleDay(h.id, i)} />
                      </div>
                    </td>
                  ))}
                  <td className="text-center py-1.5 font-medium text-ink">{achieved}</td>
                  <td className="text-center py-1.5">
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={h.goal}
                      onChange={(e) => onUpdateGoal(h.id, Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
                      className="w-9 text-center bg-transparent outline-none border border-transparent hover:border-border focus:border-sky rounded"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onDeleteHabit(h.id)}
                      aria-label="Delete habit"
                      className="opacity-0 group-hover:opacity-100 text-muted hover:text-coral px-1"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {habits.length > 0 && (
            <tfoot>
              <tr className="border-t border-border">
                <td className="py-1.5 text-[11px] uppercase tracking-wide text-muted">Total</td>
                {totals.map((t, i) => (
                  <td key={i} className="text-center text-[12px] text-muted">
                    {t}
                  </td>
                ))}
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className="pt-2 mt-1 border-t border-border">
        <InlineAddRow ref={addRowRef} placeholder="Add a habit…" accent="sky" onAdd={(name) => onAddHabit(name)} />
      </div>
    </div>
  );
}
