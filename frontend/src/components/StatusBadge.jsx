export default function StatusBadge({ value }) {
  const good = ['Available','Confirmed','Paid','CheckedOut'];
  const bad = ['Maintenance','Cancelled'];
  const css = good.includes(value) ? 'good' : bad.includes(value) ? 'bad' : 'warn';
  return <span className={`badge ${css}`}>{value || 'Unknown'}</span>;
}
