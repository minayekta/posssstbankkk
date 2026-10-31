import * as THREE from 'three';

export class GreenoWebGLUnavailableError extends Error {
  constructor() {
    super('Chrome could not create a WebGL2 context, including with antialiasing disabled and default GPU preferences.');
    this.name = 'GreenoWebGLUnavailableError';
  }
}

/** Use the actual R3F canvas; do not allocate throwaway GPU contexts. */
export function createCompatibleRenderer(canvas: HTMLCanvasElement | OffscreenCanvas, low: boolean) {
  const base: WebGLContextAttributes = { alpha: false, depth: true, stencil: false, preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: false };
  const attempts: WebGLContextAttributes[] = [
    { ...base, antialias: !low, powerPreference: 'default' },
    { ...base, antialias: false, powerPreference: 'default' },
    { ...base, antialias: false, powerPreference: 'low-power' },
    { ...base, antialias: false, powerPreference: 'high-performance' },
  ];
  for (const attributes of attempts) {
    let context: WebGL2RenderingContext | null = null;
    try { context = canvas.getContext('webgl2', attributes) as WebGL2RenderingContext | null; } catch { /* Try the next less demanding configuration. */ }
    if (context) return new THREE.WebGLRenderer({ canvas, context, ...attributes });
  }
  // Some drivers reject optional context attributes entirely.
  let context: WebGL2RenderingContext | null = null;
  try { context = canvas.getContext('webgl2') as WebGL2RenderingContext | null; } catch { /* Report a recoverable capability failure. */ }
  if (context) return new THREE.WebGLRenderer({ canvas, context });
  throw new GreenoWebGLUnavailableError();
}
