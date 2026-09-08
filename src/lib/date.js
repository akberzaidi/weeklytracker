const DAY_MS = 24 * 60 * 60 * 1000;

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HABIT_DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Monday of the ISO week containing `date`.
export function getWeekStart(date) {
  const d = stripTime(date);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(d.getTime() + diff * DAY_MS);
}

export function addDays(date, n) {
  return new Date(date.getTime() + n * DAY_MS);
}

export function addWeeks(date, n) {
  return addDays(date, n * 7);
}

// ISO 8601 week number.
function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / DAY_MS + 1) / 7);
}

function getISOWeekYear(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

export function getWeekKey(date) {
  const weekStart = getWeekStart(date);
  const week = getISOWeekNumber(weekStart);
  const year = getISOWeekYear(weekStart);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function weekKeyToStart(weekKey) {
  const [yearStr, weekStr] = weekKey.split('-W');
  const year = Number(yearStr);
  const week = Number(weekStr);
  const jan4 = new Date(year, 0, 4);
  const week1Start = getWeekStart(jan4);
  return addWeeks(week1Start, week - 1);
}

export function shiftWeekKey(weekKey, deltaWeeks) {
  const start = weekKeyToStart(weekKey);
  return getWeekKey(addWeeks(start, deltaWeeks));
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatWeekRange(weekKey) {
  const start = weekKeyToStart(weekKey);
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = `${MONTH_LABELS[start.getMonth()]} ${start.getDate()}`;
  const endLabel = sameMonth
    ? `${end.getDate()}`
    : `${MONTH_LABELS[end.getMonth()]} ${end.getDate()}`;
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
}

export function formatDayDate(weekKey, dayIndex) {
  const start = weekKeyToStart(weekKey);
  const date = addDays(start, dayIndex);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

export function isTodayInWeek(weekKey, dayIndex) {
  const start = weekKeyToStart(weekKey);
  const date = addDays(start, dayIndex);
  const today = stripTime(new Date());
  return date.getTime() === today.getTime();
}

export function getTodayWeekKey() {
  return getWeekKey(new Date());
}
