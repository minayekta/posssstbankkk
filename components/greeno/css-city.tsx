"use client";

import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import './css-city.css';

type Props = { step: number; overview: boolean; reduced: boolean; growth: number; reaction: number | null; onArrive: () => void };
const places = [
  { x: 95, y: 300, color: '#ffbd75', label: 'سکوی هدف', icon: '◎' },
  { x: 240, y: 120, color: '#67dec7', label: 'بانک پس‌انداز', icon: '▣' },
  { x: 425, y: 235, color: '#b59aff', label: 'استودیوی مهارت', icon: '✦' },
  { x: 580, y: 95, color: '#ffa7ae', label: 'بازار کوچک', icon: '▰' },
  { x: 645, y: 340, color: '#77c7ff', label: 'باغ فردا', icon: '✿' },
];
function Box({ x = 0, y = 0, z = 0, w = 60, d = 50, h = 70, color, className = '' }: { x?: number; y?: number; z?: number; w?: number; d?: number; h?: number; color: string; className?: string }) {
  return <div className={`gr3-box ${className}`} style={{ width: w, height: d, transform: `translate3d(${x}px,${y}px,${z}px)`, '--block': color, '--height': `${h}px`, '--depth': `${d}px`, '--width': `${w}px` } as CSSProperties}>
    <i className="gr3-face top"/><i className="gr3-face front"/><i className="gr3-face back"/><i className="gr3-face left"/><i className="gr3-face right"/>
  </div>;
}
function Tree({ x, y }: { x: number; y: number }) {
  return <div className="gr3-tree" style={{ left: x, top: y }}><Box w={7} d={7} h={30} z={22} color="#699790"/><div className="gr3-tree-crown"/></div>;
}
function Robot({ happy }: { happy: boolean }) {
  return <div className={`gr3-robot-float${happy ? ' celebrating' : ''}`}>
    <i className="antenna"/><i className="ear left-ear"/><i className="ear right-ear"/>
    <div className="head"><div className="head-seam"/><div className="visor"><i className="eye"/><i className="eye"/><span className="smile"/></div><i className="cheek left-cheek"/><i className="cheek right-cheek"/></div>
    <div className="neck"/><div className="body"><div className="chest-core"><span/></div><i className="body-seam"/></div>
    <i className="arm a"/><i className="arm b"/><i className="foot left-foot"/><i className="foot right-foot"/><div className="jet"/><div className="hover-ring"/>
  </div>;
}
function Landmark({ index, growth }: { index: number; growth: number }) {
  if (index === 0) return <><Box x={26} y={25} z={24} w={76} d={60} h={12} color="#edaf81" className="plinth"/><div className="gr3-target"><i/><i/><i/></div><Box x={100} y={18} z={24} w={4} d={4} h={100} color="#fff7db"/><Box x={104} y={18} z={104} w={32} d={3} h={21} color="#b9da62"/></>;
  if (index === 1) return <><Box x={22} y={20} z={24} w={88} d={64} h={75} color="#65c8ca" className="windows bank"/><Box x={16} y={14} z={99} w={100} d={76} h={10} color="#9ce7e1" className="roof"/><div className="gr3-vault"><i/><i/><i/><b/></div><Box x={37} y={35} z={110} w={52} d={28} h={9} color="#58b8af" className="roof-garden"/></>;
  if (index === 2) return <><Box x={20} y={22} z={24} w={47} d={60} h={75} color="#b09cde" className="windows"/><Box x={72} y={14} z={24} w={39} d={54} h={108} color="#72cbd3" className="windows"/><Box x={15} y={17} z={99} w={57} d={70} h={8} color="#f3d483"/><div className="gr3-dish"/></>;
  if (index === 3) return <>{[0, 1].map(k => <div key={k}><Box x={12 + k * 62} y={30} z={24} w={50} d={48} h={40} color={k ? '#ddc779' : '#8dc8c3'}/><Box x={7 + k * 62} y={23} z={64} w={60} d={60} h={12} color={k ? '#b19bd7' : '#e7a08c'} className="awning"/><Box x={10 + k * 62} y={80} z={24} w={54} d={18} h={23} color="#f4e4c6"/></div>)}</>;
  return <>{[0, 1, 2].map(k => {
    const height = [60, 110, 80][k] * (1 + Math.min(1.6, growth) * .35);
    return <div key={k}><Box x={12 + k * 39} y={k === 1 ? 12 : 40} z={24} w={32} d={44} h={height} color={['#cf9cd0', '#79bde8', '#a69ce3'][k]} className="windows tower"/><Box x={8 + k * 39} y={k === 1 ? 8 : 36} z={24 + height} w={40} d={52} h={7} color="#d4d9fa" className="roof"/></div>;
  })}</>;
}
function CSSCity({ step, overview, reduced, growth, reaction, onArrive }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 700, height: 450 });
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver(entries => { const { width, height } = entries[0].contentRect; setSize(old => old.width === width && old.height === height ? old : { width, height }); });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const moves = camera.current?.getAnimations().filter(animation => 'transitionProperty' in animation && animation.transitionProperty === 'transform') || [];
      Promise.all(moves.map(move => move.finished)).then(() => { if (!cancelled) onArrive(); }).catch(() => { /* A new destination cancels the previous transition. */ });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [step, overview, reduced, size.width, size.height, onArrive]);
  const p = places[step];
  const fit = Math.min(size.width / 940, size.height / 540);
  const zoom = overview ? 1 : Math.min(1.65, Math.max(1.25, size.width / 550));
  const focus = overview ? { x: 430, y: 270 } : { x: p.x + 65, y: p.y + 45 };
  const target = places[step];
  return <div ref={host} className={`gr3-scene${reduced ? ' still' : ''}`} role="img" aria-label="شهر سه‌بعدی گرینو با بناهای حجمی و پنج ایستگاه" data-renderer="css-3d">
    <div className="gr3-sky"><span/><span/><span/></div>
    <div ref={camera} className="gr3-camera" style={{ transform: `scale(${fit * zoom}) rotateX(52deg) rotateZ(-30deg) translate3d(${-focus.x}px,${-focus.y}px,-10px)` }}>
      <div className="gr3-ground"/>
      {places.slice(0, -1).map((a, i) => {
        const b = places[i + 1];
        const distance = Math.hypot(b.x - a.x, b.y - a.y);
        return <div key={i} className={`gr3-path${step > i ? ' lit' : ''}`} style={{ width: distance, left: a.x + 65, top: a.y + 50, transform: `translateZ(17px) rotateZ(${Math.atan2(b.y - a.y, b.x - a.x)}rad)` }}/>;
      })}
      {places.map((place, i) => <div className={`gr3-island island-${i}${step === i ? ' current' : ''}`} key={place.label} style={{ transform: `translate3d(${place.x}px,${place.y}px,0)` }}>
        <div className="gr3-shadow"/>
        <div className="gr3-island-aura" style={{ '--island-accent': place.color } as CSSProperties}/>
        <Box w={140} d={115} h={24} color="#405186" className="island-base"/>
        <Landmark index={i} growth={growth}/>
        <Tree x={0} y={70}/><Tree x={113} y={-5}/>
        <div className="gr3-sign" style={{ '--accent': place.color } as CSSProperties}><b>{place.icon}</b><span>{place.label}</span></div>
        <div className="gr3-coin" style={{ animationDelay: `${i * -.6}s` }}>✦</div>
      </div>)}
      <div className={`gr3-robot${reaction === 1 ? ' happy' : ''}`} style={{ left: target.x + 140, top: target.y + 80 }}><Robot happy={reaction === 1}/></div>
    </div>
    <span className="gr3-place-label">{overview ? 'پنج ایستگاه، یک شهر برای رؤیاهای تو' : `${(step + 1).toLocaleString('fa-IR')} / ۵ · ${p.label}`}</span>
  </div>;
}
export default memo(CSSCity);
