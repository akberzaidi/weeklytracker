import { useRef, useState } from 'react';
import Checkbox from './Checkbox';

export default function TaskItem({ text, done, onToggle, onChangeText, onDelete, accent = 'sage' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const commit = () => {
    const trimmed = draft.trim();
    setEditing(false);
    if (!trimmed) {
      onDelete();
    } else if (trimmed !== text) {
      onChangeText(trimmed);
    }
  };

  return (
    <div className="group flex items-center gap-2.5 py-1.5">
      <Checkbox checked={done} onChange={onToggle} accent={accent} />
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              setDraft(text);
              setEditing(false);
            }
          }}
          onBlur={commit}
          className="flex-1 text-[14px] bg-transparent outline-none border-b border-border"
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          title={text}
          className={`flex-1 min-w-0 text-left text-[14px] truncate transition-colors ${
            done ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {text}
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted hover:text-coral transition-opacity text-base leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}
