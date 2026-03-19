import { useRef } from 'react';

export const TraceLog = ({ steps, currentStep, mode }) => {
  // if the mode is final, display all the steps, otherwise display the current step + 1
  const displayCount = mode === 'final' ? steps.length : currentStep + 1;

  return (
    <section className="card">
      <h2>Trace Log</h2>
      <div className="trace-log-wrapper">
        <table className="trace-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Block</th>
              <th>Set</th>
              <th>Way</th>
              <th>Result</th>
              <th>Evicted</th>
              <th>Hits</th>
              <th>Misses</th>
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, displayCount).map((step, index) => (
              <tr
                key={index}
                className={[
                  step.hit ? 'row-hit' : 'row-miss',
                  mode === 'step' && index === currentStep ? 'row-active' : '',
                ].filter(Boolean).join(' ')}
              >
                <td>{step.step}</td>
                <td>{step.block}</td>
                <td>{step.setIndex}</td>
                <td>{step.wayIndex}</td>
                <td>
                  <span className={`badge ${step.hit ? 'badge-hit' : 'badge-miss'}`}>
                    {step.hit ? 'HIT' : 'MISS'}
                  </span>
                </td>
                <td>{step.evicted !== null ? step.evicted : '—'}</td>
                <td>{step.totalHits}</td>
                <td>{step.totalMisses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
