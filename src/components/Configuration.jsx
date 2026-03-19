import { CACHE_BLOCK_OPTIONS, CACHE_LINE_OPTIONS, WAYS_PER_SET } from '../constant.js';

export function Configuration({ config, onChange, onStart }) {
  const numberOfSets = Math.floor(config.cacheBlocks / WAYS_PER_SET); // 4-way fixed

  return (
    <section className="card">
      <h2>Configuration</h2>

      <div className="config-grid">
        <label className="field">
          <span>Cache Line Size</span>
          <select value={config.cacheLineWords} onChange={e => onChange('cacheLineWords', +e.target.value)}>
            {CACHE_LINE_OPTIONS.map(v => (
              <option key={v} value={v}>{v} words</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Cache Blocks (n)</span>
          <select value={config.cacheBlocks} onChange={e => onChange('cacheBlocks', +e.target.value)}>
            {CACHE_BLOCK_OPTIONS.map(v => (
              <option key={v} value={v}>{v} blocks</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Test Sequence</span>
          <select value={config.testCase} onChange={e => onChange('testCase', e.target.value)}>
            <option value="sequential">Sequential (2n, ×2)</option>
            <option value="mid-repeat">Mid-Repeat (×2)</option>
            <option value="random">Random (64 blocks)</option>
          </select>
        </label>

        <label className="field">
          <span>Algorithm</span>
          <select value={config.algorithm} onChange={e => onChange('algorithm', e.target.value)}>
            <option value="lru">BSA + LRU</option>
            <option value="mru">BSA + MRU</option>
          </select>
        </label>

        <label className="field">
          <span>View Mode</span>
          <select value={config.viewMode} onChange={e => onChange('viewMode', e.target.value)}>
            <option value="step">Step-by-Step</option>
            <option value="final">Final Snapshot</option>
          </select>
        </label>
      </div>

      <div className="config-meta">
        <span>Memory: 1024 blocks (fixed)</span>
        <span>Associativity: 4-way (fixed)</span>
        <span>Sets: {numberOfSets}</span>
        <span>Cache size: {config.cacheBlocks * config.cacheLineWords} words</span>
      </div>

      <button className="run-btn" onClick={onStart}>▶ Start</button>
    </section>
  );
}
