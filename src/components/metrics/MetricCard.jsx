export default function MetricCard({ label, value, description, primary = false }) {
  return (
    <section className={`metric ${primary ? 'primary' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </section>
  );
}
