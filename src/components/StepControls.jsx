export const StepControls = ({
  currentStep,
  totalSteps,
  isPlaying,
  activeStep,
  onFirst,
  onPrev,
  onPlay,
  onNext,
  onLast,
}) => {
  const isFirst = currentStep === 0;
  const isLast  = currentStep === totalSteps - 1;

  return (
    <section className="card">
      <div className="header">
        <h2>Cache State — Step {currentStep + 1} / {totalSteps}</h2>

        {activeStep && (
          <span className={`step-badge ${activeStep.hit ? 'badge-hit' : 'badge-miss'}`}>
            Block {activeStep.block} → Set {activeStep.setIndex}, Way {activeStep.wayIndex}
            {' · '}
            {activeStep.hit
              ? 'HIT'
              : `MISS${activeStep.evicted !== null ? ` · Evicted: ${activeStep.evicted}` : ''}`}
          </span>
        )}
      </div>

      <div className="step-controls">
        <button onClick={onFirst} disabled={isFirst} title="First">⏮</button>
        <button onClick={onPrev}  disabled={isFirst || isPlaying} title="Previous">‹ Prev</button>
        <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={onPlay}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={onNext} disabled={isLast || isPlaying} title="Next">Next ›</button>
        <button onClick={onLast} disabled={isLast} title="Last">⏭</button>
      </div>
    </section>
  );
};
