import { useEffect, useMemo, useRef } from 'react';
import { useWeekStore } from './hooks/useWeekStore';
import { getTodayWeekKey } from './lib/date';
import WeekNavigator from './components/WeekNavigator';
import CompletionRing from './components/CompletionRing';
import FocusBanner from './components/FocusBanner';
import GoalsPanel from './components/GoalsPanel';
import TodoPanel from './components/TodoPanel';
import HabitTracker from './components/HabitTracker';
import DayGrid from './components/DayGrid';
import CarryOverToast from './components/CarryOverToast';

function todayIndexFor(weekKey) {
  return weekKey === getTodayWeekKey() ? (new Date().getDay() + 6) % 7 : -1;
}

export default function App() {
  const store = useWeekStore();
  const {
    weekKey,
    week,
    isCurrentWeek,
    goToPrev,
    goToNext,
    goToToday,
    setFocus,
    updateGoalText,
    toggleGoal,
    addTodo,
    updateTodoText,
    toggleTodo,
    deleteTodo,
    addHabit,
    toggleHabitDay,
    updateHabitGoal,
    deleteHabit,
    addDayTask,
    toggleDayTask,
    updateDayTaskText,
    deleteDayTask,
    showCarryOver,
    unfinishedFromPrev,
    applyCarryOver,
    dismissCarryOver,
    habitStreaks,
  } = store;

  const todoAddRef = useRef(null);
  const habitAddRef = useRef(null);
  const goalInputRefs = useRef([]);
  const dayAddRowRefs = useRef([]);

  const todayIndex = todayIndexFor(weekKey);

  const completion = useMemo(() => {
    const setGoals = week.goals.filter((g) => g.text.trim());
    const totalItems = setGoals.length + week.todos.length;
    const doneItems = setGoals.filter((g) => g.done).length + week.todos.filter((t) => t.done).length;
    return totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
  }, [week.goals, week.todos]);

  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (typing) return;

      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        const idx = isCurrentWeek ? Math.max(0, todayIndex) : 0;
        dayAddRowRefs.current[idx]?.focus();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        todoAddRef.current?.focus();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        const emptyIndex = week.goals.findIndex((g) => !g.text.trim());
        const idx = emptyIndex === -1 ? week.goals.length - 1 : emptyIndex;
        goalInputRefs.current[idx]?.focus();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        habitAddRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToPrev, goToNext, isCurrentWeek, todayIndex, week.goals]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-border no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <span className="font-display font-semibold text-[15px] text-sage shrink-0">Weekly Tracker</span>
          <WeekNavigator
            weekKey={weekKey}
            isCurrentWeek={isCurrentWeek}
            onPrev={goToPrev}
            onNext={goToNext}
            onToday={goToToday}
          />
          <CompletionRing percent={completion} />
        </div>
      </header>

      <main key={weekKey} className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 pb-20">
        <FocusBanner value={week.focus} onChange={setFocus} />

        <section>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.4fr] gap-4 items-stretch">
            <GoalsPanel
              goals={week.goals}
              onChangeText={updateGoalText}
              onToggle={toggleGoal}
              inputRefs={goalInputRefs}
            />
            <TodoPanel
              todos={week.todos}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onChangeText={updateTodoText}
              onDelete={deleteTodo}
              addRowRef={todoAddRef}
            />
            <HabitTracker
              habits={week.habits}
              streaks={habitStreaks}
              onAddHabit={addHabit}
              onToggleDay={toggleHabitDay}
              onUpdateGoal={updateHabitGoal}
              onDeleteHabit={deleteHabit}
              todayIndex={todayIndex}
              addRowRef={habitAddRef}
            />
          </div>
        </section>

        <section>
          <h2 className="section-label mb-3">Days</h2>
          <DayGrid
            weekKey={weekKey}
            days={week.days}
            todayIndex={todayIndex}
            onAddTask={addDayTask}
            onToggleTask={toggleDayTask}
            onChangeTaskText={updateDayTaskText}
            onDeleteTask={deleteDayTask}
            dayAddRowRefs={dayAddRowRefs}
          />
        </section>
      </main>

      {showCarryOver && (
        <CarryOverToast count={unfinishedFromPrev.length} onApply={applyCarryOver} onDismiss={dismissCarryOver} />
      )}
    </div>
  );
}
