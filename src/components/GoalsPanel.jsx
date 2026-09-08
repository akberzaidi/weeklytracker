import Checkbox from './Checkbox';
import SectionLabel from './SectionLabel';

export default function GoalsPanel({ goals, onChangeText, onToggle, inputRefs }) {
  const doneCount = goals.filter((g) => g.done && g.text.trim()).length;
  const setCount = goals.filter((g) => g.text.trim()).length;

  return (
    <div className="panel bg-sage-tint/50 border-sage/20 p-4 sm:p-5 flex flex-col h-full">
      <SectionLabel right={setCount > 0 && <span className="text-[11px] text-muted">{doneCount}/{setCount}</span>}>
        Weekly Goals
      </SectionLabel>
      <div className="flex flex-col flex-1">
        {goals.map((goal, i) => (
          <div key={goal.id} className="flex items-center gap-2.5 py-1.5 border-b border-sage/15 last:border-0">
            <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-white text-[11px] font-semibold text-sage">
              {i + 1}
            </span>
            <input
              ref={inputRefs ? (el) => (inputRefs.current[i] = el) : undefined}
              value={goal.text}
              onChange={(e) => onChangeText(i, e.target.value)}
              placeholder="—"
              className={`flex-1 min-w-0 bg-transparent outline-none text-[14px] placeholder:text-sage/30 ${
                goal.done && goal.text ? 'line-through text-muted' : 'text-ink'
              }`}
            />
            <Checkbox checked={goal.done} onChange={() => onToggle(i)} accent="sage" />
          </div>
        ))}
      </div>
    </div>
  );
}
