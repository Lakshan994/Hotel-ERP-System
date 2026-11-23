export default function Notice({ error, success }) {
  if (!error && !success) return null;
  return <div role="alert" className={error ? 'notice notice-error' : 'notice notice-success'}>{error || success}</div>;
}
