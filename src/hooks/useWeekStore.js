import { useCallback, useEffect, useMemo, useState } from 'react';
import { makeId } from '../lib/id';
import { getTodayWeekKey, shiftWeekKey } from '../lib/date';

const STORAGE_KEY = 'weekly-tracker/v1';

function createEmptyWeek(weekKey) {
  return {
    weekKey,
    focus: '',
    goals: Array.from({ length: 7 }, () => ({ id: makeId(), text: '', done: false })),
    todos: [],
    habits: [],
    days: Array.from({ length: 7 }, () => []),
    carryOverHandled: false,
  };
}

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function useWeekStore() {
  const [weeks, setWeeks] = useState(loadAll);
  const [weekKey, setWeekKey] = useState(getTodayWeekKey);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
    } catch {
      // storage unavailable (private mode, quota) — fail silently
    }
  }, [weeks]);

  const week = weeks[weekKey] || createEmptyWeek(weekKey);

  const updateWeek = useCallback(
    (key, updater) => {
      setWeeks((prev) => {
        const base = prev[key] || createEmptyWeek(key);
        return { ...prev, [key]: updater(base) };
      });
    },
    [],
  );

  const patch = useCallback((fields) => updateWeek(weekKey, (w) => ({ ...w, ...fields })), [updateWeek, weekKey]);

  // --- navigation ---
  const goToPrev = useCallback(() => setWeekKey((k) => shiftWeekKey(k, -1)), []);
  const goToNext = useCallback(() => setWeekKey((k) => shiftWeekKey(k, 1)), []);
  const goToToday = useCallback(() => setWeekKey(getTodayWeekKey()), []);
  const isCurrentWeek = weekKey === getTodayWeekKey();

  // --- focus ---
  const setFocus = useCallback((text) => patch({ focus: text }), [patch]);

  // --- goals (fixed 7 slots) ---
  const updateGoalText = useCallback(
    (index, text) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        goals: w.goals.map((g, i) => (i === index ? { ...g, text } : g)),
      })),
    [updateWeek, weekKey],
  );

  const toggleGoal = useCallback(
    (index) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        goals: w.goals.map((g, i) => (i === index ? { ...g, done: !g.done } : g)),
      })),
    [updateWeek, weekKey],
  );

  // --- todos ---
  const addTodo = useCallback(
    (text) => {
      if (!text.trim()) return;
      updateWeek(weekKey, (w) => ({
        ...w,
        todos: [...w.todos, { id: makeId(), text: text.trim(), done: false }],
      }));
    },
    [updateWeek, weekKey],
  );

  const updateTodoText = useCallback(
    (id, text) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        todos: w.todos.map((t) => (t.id === id ? { ...t, text } : t)),
      })),
    [updateWeek, weekKey],
  );

  const toggleTodo = useCallback(
    (id) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        todos: w.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      })),
    [updateWeek, weekKey],
  );

  const deleteTodo = useCallback(
    (id) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        todos: w.todos.filter((t) => t.id !== id),
      })),
    [updateWeek, weekKey],
  );

  // --- habits ---
  const addHabit = useCallback(
    (name, goal = 7) => {
      if (!name.trim()) return;
      updateWeek(weekKey, (w) => ({
        ...w,
        habits: [
          ...w.habits,
          { id: makeId(), name: name.trim(), goal, days: Array(7).fill(false) },
        ],
      }));
    },
    [updateWeek, weekKey],
  );

  const toggleHabitDay = useCallback(
    (habitId, dayIndex) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        habits: w.habits.map((h) =>
          h.id === habitId
            ? { ...h, days: h.days.map((v, i) => (i === dayIndex ? !v : v)) }
            : h,
        ),
      })),
    [updateWeek, weekKey],
  );

  const updateHabitGoal = useCallback(
    (habitId, goal) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        habits: w.habits.map((h) => (h.id === habitId ? { ...h, goal } : h)),
      })),
    [updateWeek, weekKey],
  );

  const updateHabitName = useCallback(
    (habitId, name) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        habits: w.habits.map((h) => (h.id === habitId ? { ...h, name } : h)),
      })),
    [updateWeek, weekKey],
  );

  const deleteHabit = useCallback(
    (habitId) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        habits: w.habits.filter((h) => h.id !== habitId),
      })),
    [updateWeek, weekKey],
  );

  // --- day tasks ---
  const addDayTask = useCallback(
    (dayIndex, text) => {
      if (!text.trim()) return;
      updateWeek(weekKey, (w) => ({
        ...w,
        days: w.days.map((tasks, i) =>
          i === dayIndex ? [...tasks, { id: makeId(), text: text.trim(), done: false }] : tasks,
        ),
      }));
    },
    [updateWeek, weekKey],
  );

  const toggleDayTask = useCallback(
    (dayIndex, id) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        days: w.days.map((tasks, i) =>
          i === dayIndex ? tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) : tasks,
        ),
      })),
    [updateWeek, weekKey],
  );

  const updateDayTaskText = useCallback(
    (dayIndex, id, text) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        days: w.days.map((tasks, i) =>
          i === dayIndex ? tasks.map((t) => (t.id === id ? { ...t, text } : t)) : tasks,
        ),
      })),
    [updateWeek, weekKey],
  );

  const deleteDayTask = useCallback(
    (dayIndex, id) =>
      updateWeek(weekKey, (w) => ({
        ...w,
        days: w.days.map((tasks, i) => (i === dayIndex ? tasks.filter((t) => t.id !== id) : tasks)),
      })),
    [updateWeek, weekKey],
  );

  // --- carry-over of unfinished todos from previous week ---
  const prevWeekKey = shiftWeekKey(weekKey, -1);
  const prevWeek = weeks[prevWeekKey];
  const unfinishedFromPrev = useMemo(
    () => (prevWeek ? prevWeek.todos.filter((t) => !t.done) : []),
    [prevWeek],
  );
  const showCarryOver =
    !week.carryOverHandled && unfinishedFromPrev.length > 0 && week.todos.length === 0;

  const applyCarryOver = useCallback(() => {
    updateWeek(weekKey, (w) => ({
      ...w,
      todos: [
        ...w.todos,
        ...unfinishedFromPrev.map((t) => ({ id: makeId(), text: t.text, done: false })),
      ],
      carryOverHandled: true,
    }));
  }, [updateWeek, weekKey, unfinishedFromPrev]);

  const dismissCarryOver = useCallback(
    () => updateWeek(weekKey, (w) => ({ ...w, carryOverHandled: true })),
    [updateWeek, weekKey],
  );

  // --- habit streaks: consecutive prior weeks (incl. current) where achieved >= goal ---
  const habitStreaks = useMemo(() => {
    const streaks = {};
    week.habits.forEach((h) => {
      let streak = 0;
      let cursor = weekKey;
      // count current week if goal already met
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const w = weeks[cursor];
        if (!w) break;
        const match = w.habits.find((x) => x.name.toLowerCase() === h.name.toLowerCase());
        if (!match) break;
        const achieved = match.days.filter(Boolean).length;
        if (achieved < match.goal) break;
        streak += 1;
        cursor = shiftWeekKey(cursor, -1);
      }
      streaks[h.id] = streak;
    });
    return streaks;
  }, [week.habits, weekKey, weeks]);

  return {
    weekKey,
    week,
    isCurrentWeek,
    goToPrev,
    goToNext,
    goToToday,
    goToWeek: setWeekKey,
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
    updateHabitName,
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
  };
}
