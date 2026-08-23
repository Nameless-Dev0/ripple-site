import { useEffect, useRef, useState } from 'react';
import Wave from 'react-wavify';

// Same two curves the original canvas wave used: a quick eased rise for the
// impact, then a bouncy decay back to rest for the settle. Reused here so
// pressing "Apply Filter" reproduces that original swash, just driven by
// react-wavify's options instead of hand-rolled canvas drawing.
const IMPACT_DURATION = 420; // ms — quick upward surge
const SETTLE_DURATION = 1700; // ms — decaying bounce back to rest

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) {
    x -= 1.5 / d1;
    return n1 * x * x + 0.75;
  }
  if (x < 2.5 / d1) {
    x -= 2.25 / d1;
    return n1 * x * x + 0.9375;
  }
  x -= 2.625 / d1;
  return n1 * x * x + 0.984375;
}

function swashEnvelope(elapsed) {
  if (elapsed < IMPACT_DURATION) {
    const p = elapsed / IMPACT_DURATION;
    return Math.sin(p * (Math.PI / 2));
  }
  if (elapsed < IMPACT_DURATION + SETTLE_DURATION) {
    const p = (elapsed - IMPACT_DURATION) / SETTLE_DURATION;
    return 1 - easeOutBounce(p);
  }
  return 0;
}

export default function WaveBackground({ splashSeed }) {
  const [boost, setBoost] = useState(0);
  const rafRef = useRef(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Don't swash on initial mount, only on subsequent triggers.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      setBoost(swashEnvelope(elapsed));
      if (elapsed < IMPACT_DURATION + SETTLE_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setBoost(0);
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashSeed]);

  return (
    <div className="wave-stage" aria-hidden="true">
      <Wave
        className="wave-layer wave-back"
        fill="var(--accent)"
        style={{ opacity: 0.12 }}
        options={{ height: 30, amplitude: 12, speed: 0.1, points: 4 }}
      />
      <Wave
        className="wave-layer wave-mid"
        fill="var(--accent)"
        style={{ opacity: 0.2 }}
        options={{ height: 22, amplitude: 16, speed: 0.18, points: 4 }}
      />
      <Wave
        className="wave-layer wave-front"
        fill="var(--accent)"
        style={{ opacity: 0.34 }}
        options={{
          height: 14 + boost * 12,
          amplitude: 18 + boost * 26,
          speed: 0.26,
          points: 5,
        }}
      />
    </div>
  );
}
