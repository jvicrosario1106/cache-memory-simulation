import { useRef } from 'react';

export const SequenceViewer = ({ steps, currentStep, mode }) => {
  const activeRef  = useRef(null);
  const wrapperRef = useRef(null);

  const chipClass = (index) => {
    if (index > currentStep && mode === 'step') return 'chip chip-pending';
    if (index === currentStep && mode === 'step') return `chip chip-active ${steps[index].hit ? 'chip-hit' : 'chip-miss'}`;
    return `chip ${steps[index].hit ? 'chip-hit' : 'chip-miss'}`;
  };

  return (
    <>
      <h2>Access Sequence</h2>
      <div className="sequence-wrapper" ref={wrapperRef}>
        {steps.map((step, index) => (
          <span
            key={index}
            ref={index === currentStep ? activeRef : null}
            className={chipClass(index)}
            title={`Access #${step.step}: Block ${step.block} — ${step.hit ? 'HIT' : 'MISS'}`}
          >
            {step.block}
          </span>
        ))}
      </div>
    </>
  );
};
