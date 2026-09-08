import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const ACCENT_RING = {
  sage: 'focus:border-sage',
  coral: 'focus:border-coral',
  sky: 'focus:border-sky',
  amber: 'focus:border-amber',
};

const InlineAddRow = forwardRef(function InlineAddRow(
  { placeholder = 'Add item…', onAdd, accent = 'sage', className = '' },
  ref,
) {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      setActive(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
  }));

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setActive(false);
      return;
    }
    onAdd(trimmed);
    setValue('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => {
          setActive(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className={`w-full text-left text-[13px] text-muted/70 hover:text-muted py-1.5 transition-colors ${className}`}
      >
        + {placeholder}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          setValue('');
          setActive(false);
        }
      }}
      onBlur={() => {
        if (value.trim()) commit();
        setActive(false);
      }}
      placeholder={placeholder}
      className={`w-full text-[14px] bg-transparent outline-none py-1.5 border-b border-transparent ${ACCENT_RING[accent]} ${className}`}
    />
  );
});

export default InlineAddRow;
