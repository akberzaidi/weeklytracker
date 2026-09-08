const ACCENT_CLASSES = {
  sage: 'bg-sage border-sage',
  coral: 'bg-coral border-coral',
  sky: 'bg-sky border-sky',
  amber: 'bg-amber border-amber',
};

export default function Checkbox({ checked, onChange, accent = 'sage', size = 18 }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`shrink-0 flex items-center justify-center rounded-md border-[1.5px] transition-colors duration-150 ${
        checked ? ACCENT_CLASSES[accent] : 'bg-white border-border hover:border-muted'
      }`}
      style={{ width: size, height: size }}
    >
      {checked && (
        <svg
          viewBox="0 0 16 16"
          className="w-[10px] h-[10px] text-white animate-check-pop"
          fill="none"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
