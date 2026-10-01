/** Minimal summary tile used across dashboard and transactions. */
export default function StatCard({ icon, label, value, hint, onClick, active, tone = "brand" }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`stat-card tone-${tone} ${active ? "is-active" : ""} ${onClick ? "is-clickable" : ""}`}>
      {icon && <span className="stat-icon">{icon}</span>}
      <span className="stat-text">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {hint && <span className="stat-hint">{hint}</span>}
      </span>
    </Tag>
  );
}
