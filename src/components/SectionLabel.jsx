export default function SectionLabel({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="section-label">{children}</h2>
      {right}
    </div>
  );
}
