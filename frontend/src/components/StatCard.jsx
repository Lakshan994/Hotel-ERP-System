export default function StatCard({ label, value, sub, symbol }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{symbol || '◈'}</span></div><strong className="stat-value">{value}</strong><small>{sub || 'Live database total'}</small></div>;
}
