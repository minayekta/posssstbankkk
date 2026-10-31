"use client";

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function benchmarkMode(): 'before' | 'after' | null {
  if (typeof window === 'undefined') return null;
  const mode = new URLSearchParams(window.location.search).get('greeno-bench');
  return mode === 'before' || mode === 'after' ? mode : null;
}

/** Opt-in instrumentation only. No per-frame React state or array allocations. */
export function Benchmark() {
  const samples = useRef({ mode: benchmarkMode(), firstFrame: 0, started: 0, count: 0, frames: new Float64Array(900), calls: new Float64Array(900), complete: false, skipNext: false });
  useEffect(() => {
    const sample = samples.current;
    if (!sample.mode) return;
    const visibility = () => { sample.skipNext = true; };
    document.addEventListener('visibilitychange', visibility);
    const read = () => {
      const values = Array.from(sample.frames.subarray(0, sample.count)).sort((a, b) => a - b);
      const draws = Array.from(sample.calls.subarray(0, sample.count)).sort((a, b) => a - b);
      const percentile = (array: number[], fraction: number) => array.length ? array[Math.min(array.length - 1, Math.floor(array.length * fraction))] : null;
      return { mode: sample.mode, viewport: [innerWidth, innerHeight], devicePixelRatio, userAgent: navigator.userAgent, samples: sample.count, firstFrameFromNavigationMs: sample.firstFrame, frameMsMedian: percentile(values, .5), frameMsP95: percentile(values, .95), drawCallsMedian: percentile(draws, .5), complete: sample.complete };
    };
    Object.assign(window, { __greenoBenchmark: { read } });
    return () => { document.removeEventListener('visibilitychange', visibility); Reflect.deleteProperty(window, '__greenoBenchmark'); };
  }, []);
  useFrame(({ gl }, delta) => {
    const s = samples.current;
    if (!s.mode || s.complete) return;
    const now = performance.now();
    if (!s.firstFrame) { if (gl.info.render.calls === 0) return; s.firstFrame = now; s.started = now; }
    if (now - s.started < 3000 || document.hidden) return;
    if (s.skipNext) { s.skipNext = false; return; }
    const index = s.count++;
    s.frames[index] = delta * 1000;
    s.calls[index] = gl.info.render.calls;
    if (s.count >= s.frames.length) s.complete = true;
  });
  return null;
}
