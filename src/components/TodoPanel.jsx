import { useMemo } from 'react';
import TaskItem from './TaskItem';
import InlineAddRow from './InlineAddRow';
import SectionLabel from './SectionLabel';

export default function TodoPanel({ todos, onAdd, onToggle, onChangeText, onDelete, addRowRef }) {
  const sorted = useMemo(() => [...todos].sort((a, b) => Number(a.done) - Number(b.done)), [todos]);
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="panel p-4 sm:p-5 flex flex-col h-full">
      <SectionLabel right={todos.length > 0 && <span className="text-[11px] text-muted">{doneCount}/{todos.length}</span>}>
        To-Do List
      </SectionLabel>
      <div className="flex-1 overflow-y-auto max-h-[260px] pr-1 -mr-1">
        {sorted.length === 0 && <p className="text-[13px] text-muted/70 py-1">No to-dos yet.</p>}
        {sorted.map((t) => (
          <TaskItem
            key={t.id}
            text={t.text}
            done={t.done}
            accent="coral"
            onToggle={() => onToggle(t.id)}
            onChangeText={(text) => onChangeText(t.id, text)}
            onDelete={() => onDelete(t.id)}
          />
        ))}
      </div>
      <div className="pt-2 mt-1 border-t border-border">
        <InlineAddRow ref={addRowRef} placeholder="Add a to-do…" accent="coral" onAdd={onAdd} />
      </div>
    </div>
  );
}
