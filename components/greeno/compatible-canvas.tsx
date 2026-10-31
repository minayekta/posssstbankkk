"use client";

import { createRoot, extend, unmountComponentAtNode } from '@react-three/fiber';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { createCompatibleRenderer, GreenoWebGLUnavailableError } from './webgl-renderer';
import CityPreview from './city-preview';

extend({ Color: THREE.Color, Fog: THREE.Fog, AmbientLight: THREE.AmbientLight, HemisphereLight: THREE.HemisphereLight, DirectionalLight: THREE.DirectionalLight, PointLight: THREE.PointLight });
class RootErrors extends Component<{ children: ReactNode; report: (error: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.report(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Initialize the real canvas before configuring R3F, so capability failures are
 * handled locally rather than becoming rejected renderer-configuration promises. */
export default function CompatibleCanvas({ children, low, reduced, benchmark, onUnavailable, retry }: {
  children: ReactNode; low: boolean; reduced: boolean; benchmark: boolean; onUnavailable?: () => void; retry?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef({ children, reduced });
  const refresh = useRef<(() => void) | null>(null);
  const [failure, setFailure] = useState<Error | null>(null);
  useEffect(() => { view.current = { children, reduced }; refresh.current?.(); }, [children, reduced]);
  useEffect(() => { if (failure) onUnavailable?.(); }, [failure, onUnavailable]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    canvas.setAttribute('aria-label', 'شهر سه‌بعدی گرینو با پنج ایستگاه متصل');
    container.appendChild(canvas);
    let renderer: THREE.WebGLRenderer;
    try { renderer = createCompatibleRenderer(canvas, low); }
    catch (error) {
      canvas.remove();
      queueMicrotask(() => setFailure(error instanceof Error ? error : new Error(String(error))));
      return;
    }
    const root = createRoot(canvas);
    const camera = { position: [12, 12, 17] as [number, number, number], fov: benchmark ? 40 : 42 };
    const dpr: number | [number, number] = benchmark || low ? 1 : [1, 1.5];
    let active = true;
    const shutdown = () => {
      if (!active) return;
      active = false;
      refresh.current = null;
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', contextLost);
      unmountComponentAtNode(canvas, () => renderer.dispose());
      canvas.remove();
    };
    const report = (error: Error) => { if (active) { shutdown(); setFailure(error); } };
    const contextLost = (event: Event) => { event.preventDefault(); report(new GreenoWebGLUnavailableError()); };
    const render = () => {
      if (!active) return;
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      root.configure({
        gl: renderer, size: { width, height, top: 0, left: 0 },
        camera,
        shadows: low ? false : 'percentage',
        frameloop: view.current.reduced && !benchmark ? 'demand' : 'always',
        dpr,
      }).then(() => { if (active) root.render(<RootErrors report={report}>{view.current.children}</RootErrors>); }).catch(report);
    };
    refresh.current = render;
    canvas.addEventListener('webglcontextlost', contextLost);
    const observer = new ResizeObserver(render);
    observer.observe(container);
    render();
    return shutdown;
  }, [low, benchmark]);
  if (failure) return <CityPreview retry={retry || (() => window.location.reload())} webglUnavailable={failure.name === 'GreenoWebGLUnavailableError'}/>;
  return <div ref={host} style={{ width: '100%', height: '100%', position: 'relative' }}/>;
}
