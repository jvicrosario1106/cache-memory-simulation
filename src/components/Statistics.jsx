export const Statistics = ({ result }) => {
  
  const statistics = [
    { label: 'Memory Access Count', value: result.totalAccesses },
    { label: 'Cache Hit Count', value: result.hitCount, variant: 'hit' },
    { label: 'Cache Miss Count', value: result.missCount, variant: 'miss' },
    { label: 'Cache Hit Rate', value: `${(result.hitRate * 100).toFixed(2)}%`, variant: 'hit' },
    { label: 'Cache Miss Rate', value: `${(result.missRate * 100).toFixed(2)}%`, variant: 'miss' },
    { label: 'Miss Penalty', value: `${result.missPenalty.toFixed(2)} ns` },
    { label: 'Avg Access Time', value: `${result.avgAccessTime.toFixed(2)} ns` },
    { label: 'Total Access Time', value: `${result.totalAccessTime.toFixed(2)} ns` },
  ];

  return (
    <section className="card">
      <h2>Statistics</h2>

      <div className="stats-grid">
        {statistics.map(({ label, value, variant }) => (
          <div key={label} className={`stat-card ${variant ?? ''}`}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="formula-note">
        <p><strong>Read Policy:</strong> Non Load-Through</p>
        <ul>
          <li><code>Hit Rate</code> = hits / total accesses</li>
          <li><code>Miss Rate</code> = misses / total accesses</li>
        </ul>
      </div>

    </section>
  );
}
