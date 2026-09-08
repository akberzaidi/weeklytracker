import DayCard from './DayCard';
import { DAY_LABELS } from '../lib/date';

export default function DayGrid({
  weekKey,
  days,
  todayIndex,
  onAddTask,
  onToggleTask,
  onChangeTaskText,
  onDeleteTask,
  dayAddRowRefs,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {DAY_LABELS.map((_, dayIndex) => (
        <DayCard
          key={dayIndex}
          weekKey={weekKey}
          dayIndex={dayIndex}
          tasks={days[dayIndex]}
          isToday={dayIndex === todayIndex}
          onAdd={(text) => onAddTask(dayIndex, text)}
          onToggle={(id) => onToggleTask(dayIndex, id)}
          onChangeText={(id, text) => onChangeTaskText(dayIndex, id, text)}
          onDelete={(id) => onDeleteTask(dayIndex, id)}
          addRowRef={dayAddRowRefs ? (el) => (dayAddRowRefs.current[dayIndex] = el) : undefined}
        />
      ))}
    </div>
  );
}
