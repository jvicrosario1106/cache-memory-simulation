import { SequenceViewer } from './SequenceViewer';

export const CacheTable = ({
  snapshot, waysPerSet, activeSet, activeWay, isHit,
  steps, currentStep, mode,
}) => {
  
  if (!snapshot || snapshot.length === 0) return null;

  return (
    <section className="card">
      <h2>Cache Table</h2>
      <div className="cache-table-wrapper">
        <table className="cache-table">
          <thead>
            <tr>
              <th className="col-set">Set</th>
              {Array.from({ length: waysPerSet }, (_, index) => (
                <th key={index}>Way {index}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {snapshot.map((set, setIndex) => (
              <tr key={setIndex} className={setIndex === activeSet ? 'active-set-row' : ''}>
                <td className="set-label">S{setIndex}</td>
                {set.map((way, wayIndex) => {
                  const isActive = setIndex === activeSet && wayIndex === activeWay;
                  return (
                    <td
                      key={wayIndex}
                      className={[
                        'way-cell',
                        way.block !== null ? 'occupied' : 'empty',
                        isActive ? (isHit ? 'cell-hit' : 'cell-miss') : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {way.block !== null ? way.block : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="sequence-divider" />
      <SequenceViewer steps={steps} currentStep={currentStep} mode={mode} /> */}
    </section>
  );
};
