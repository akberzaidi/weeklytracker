import { useRef, useState } from 'react';

export default function FocusBanner({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        onBlur={commit}
        placeholder="What's the one thing this week?"
        className="w-full font-display text-[20px] sm:text-[24px] font-medium text-ink bg-transparent outline-none border-b border-sage/40 pb-1.5"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className="w-full text-left font-display text-[20px] sm:text-[24px] font-medium pb-1.5 border-b border-transparent hover:border-border transition-colors"
    >
      {value ? (
        <span className="text-ink">{value}</span>
      ) : (
        <span className="text-muted/60">What's the one thing this week?</span>
      )}
    </button>
  );
}
