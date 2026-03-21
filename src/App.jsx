import { useCallback, useEffect, useRef, useState } from 'react';
import { generateSequence, runBSALRU } from './algo/bsa-lru';
import { runBSAMRU } from './algo/bsa-mru';
import './App.css';
import { CacheTable }    from './components/CacheTable';
import { Configuration } from './components/Configuration';
import { Statistics }    from './components/Statistics.jsx';
import { StepControls }  from './components/StepControls';
import { TraceLog }      from './components/TraceLog';
import { WAYS_PER_SET } from './constant.js';

export default function App() {
  // initial config
  const [config, setConfig] = useState({
    cacheLineWords: 2,
    cacheBlocks: 4,
    testCase: 'sequential',
    viewMode: 'step',
    algorithm: 'lru',
  });

  const [result, setResult]           = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isDark, setIsDark]           = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  const intervalRef = useRef(null);

  // apply theme to html so CSS variables update globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleChange = (key, value) => {
    // update config
    setConfig(prev => ({ ...prev, [key]: value }));
    // reset result if cache blocks or algorithm changes
    if (key === 'cacheBlocks' || key === 'algorithm') setResult(null);
    // stop playing if view mode changes
    if (key === 'viewMode') stopPlaying();
  };

  const stopPlaying = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  const onStart = () => {
    stopPlaying();
    const sequence  = generateSequence(config.testCase, config.cacheBlocks);
    const simulationResult = config.algorithm === "lru" ? runBSALRU(sequence, config.cacheBlocks, WAYS_PER_SET, config.cacheLineWords) : runBSAMRU(sequence, config.cacheBlocks, WAYS_PER_SET, config.cacheLineWords);
    setResult(simulationResult);
    setCurrentStep(0);
    console.log(simulationResult);
  };

  const handlePlay = useCallback(() => {
    if (!result) return;

    if (isPlaying) { 
      stopPlaying(); 
      return; 
    }

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        // if the current step is the last step, stop the interval and set the playing state to false
        if (prev >= result.steps.length - 1) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

  }, [isPlaying, result, stopPlaying]);

  const { viewMode, algorithm } = config;

  const activeStep = result?.steps[currentStep];

  const displaySnapshot = viewMode === 'step' ? activeStep?.snapshot : result?.steps[result.steps.length - 1]?.snapshot;

  return (
    <div className="app">
      <header className="app-header">
        
        <button className="theme-toggle" onClick={() => setIsDark(prevValue => !prevValue)}>
          {isDark ? '☀ Light' : '☾ Dark'}
        </button>

        <h1>BSA-{algorithm.toUpperCase()} Cache Simulator</h1>
        <p>Block Set Associative · {algorithm === 'lru' ? 'Least Recently Used' : 'Most Recently Used'} · Non Load-Through Read Policy</p>
        
        <p className="author">David Justin Pacheco & Julius Victor Rosario</p>
      </header>

      <main className="app-main">
        <Configuration config={config} onChange={handleChange} onStart={onStart} />

        {/* Display result if it exists (simulation has been run) */}
        {result && (
          <>
            {/* Display statistics */}
            <Statistics result={result} />

            {/* Display step controls if view mode is step */}
            {viewMode === 'step' && (
              <StepControls
                currentStep={currentStep}
                totalSteps={result.steps.length}
                isPlaying={isPlaying}
                activeStep={activeStep}
                onFirst={() => { 
                  stopPlaying(); 
                  setCurrentStep(0); 
                }}
                onPrev={() => setCurrentStep(step => Math.max(0, step - 1))}
                onPlay={handlePlay} 
                onNext={() => setCurrentStep(step => Math.min(result.steps.length - 1, step + 1))}
                onLast={() => { 
                  stopPlaying(); 
                  setCurrentStep(result.steps.length - 1); 
                }}
              />
            )}

            <CacheTable
              snapshot={displaySnapshot ?? []}
              numberOfSets={result.numberOfSets}
              waysPerSet={result.waysPerSet}
              activeSet={viewMode === 'step' ? (activeStep?.setIndex ?? null) : null}
              activeWay={viewMode === 'step' ? (activeStep?.wayIndex ?? null) : null}
              isHit={viewMode === 'step' ? (activeStep?.hit ?? false) : false}
              steps={result.steps}
              currentStep={currentStep}
              mode={viewMode}
            />

            <TraceLog steps={result.steps} currentStep={currentStep} mode={viewMode} />
          </>
        )}
      </main>
    </div>
  );
}
