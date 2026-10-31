"use client";

// Frozen pre-redesign scene, loaded only by ?greeno-bench=before for A/B measurements.

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Benchmark, benchmarkMode } from './benchmark';

type Props = { step: number; overview: boolean; reduced: boolean; growth: number; reaction: number | null; onArrive: () => void };
const points: [number, number, number][] = [[-5, 0, 1], [-2.4, .1, -2.1], [1, .3, -.6], [4.1, .1, -2], [5, .5, 2.2]];
const colors = ['#b4f668', '#42e4b6', '#ba9bff', '#41daeb', '#b9fa60'];
function Box({ position, scale, color, glow = false }: { position: [number, number, number]; scale: [number, number, number]; color: string; glow?: boolean }) {
  return <mesh position={position} scale={scale} castShadow receiveShadow><boxGeometry/><meshStandardMaterial color={color} roughness={.45} metalness={.2} emissive={color} emissiveIntensity={glow ? .8 : .04}/></mesh>;
}
function Building({ x, z, height, color, growth }: { x: number; z: number; height: number; color: string; growth: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (group.current) group.current.scale.y = THREE.MathUtils.damp(group.current.scale.y, 1 + growth * .65, 3, dt); });
  return <group position={[x, .3, z]} ref={group}><Box position={[0, height / 2, 0]} scale={[.62, height, .6]} color={color}/><Box position={[0, height + .05, 0]} scale={[.74, .1, .72]} color="#b8ff80" glow/>{[.3, .65, 1].filter(y => y < height).map(y => <group key={y}><Box position={[0, y, .306]} scale={[.4, .065, .015]} color="#9dfbe0" glow/><Box position={[.316, y, 0]} scale={[.015, .065, .38]} color="#9dfbe0" glow/></group>)}</group>;
}
function Coin({ position, reduced }: { position: [number, number, number]; reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => { if (mesh.current && !reduced) { mesh.current.rotation.z += dt * .65; mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * .1; } });
  return <mesh ref={mesh} position={position} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.23, .23, .075, 20]}/><meshStandardMaterial color="#e6ff77" metalness={.65} roughness={.24} emissive="#b4e94c" emissiveIntensity={.2}/></mesh>;
}
function Bridge({ a, b, lit }: { a: number[]; b: number[]; lit: boolean }) {
  const mid = new THREE.Vector3((a[0] + b[0]) / 2, .03, (a[2] + b[2]) / 2);
  const length = Math.hypot(a[0] - b[0], a[2] - b[2]);
  return <group position={mid} rotation={[0, -Math.atan2(b[2] - a[2], b[0] - a[0]), 0]}><Box position={[0, 0, 0]} scale={[length, .12, .42]} color="#294a63"/>{[-.2, .2].map(z => <Box key={z} position={[0, .09, z]} scale={[length, .035, .035]} color={lit ? '#baff65' : '#466173'} glow={lit}/>)}</group>;
}
function Robot({ step, reduced, reaction }: Pick<Props, 'step' | 'reduced' | 'reaction'>) {
  const robot = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!robot.current) return;
    const p = points[step];
    const target = new THREE.Vector3(p[0] + .9, p[1] + 2.1 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 2) * .13), p[2] + .8);
    robot.current.position.lerp(target, reduced ? 1 : 1 - Math.exp(-dt * 2));
    robot.current.rotation.y = -.3 + (reduced ? 0 : Math.sin(state.clock.elapsedTime) * .15);
    if (eyes.current) eyes.current.scale.y = !reduced && state.clock.elapsedTime % 4 > 3.8 ? .1 : 1;
  });
  return <group ref={robot} position={[-4, 2, 2]}>
    <mesh castShadow><sphereGeometry args={[.48, 24, 20]}/><meshStandardMaterial color="#e7f9ef" metalness={.3} roughness={.25}/></mesh>
    <Box position={[0, .02, .4]} scale={[.64, .3, .12]} color="#092a37"/>
    <group ref={eyes}>{[-.16, .16].map(x => <Box key={x} position={[x, .04, .477]} scale={[.085, reaction === 1 ? .13 : .085, .03]} color={reaction === 0 ? '#d7b2ff' : '#a6ff6b'} glow/>)}</group>
    <mesh position={[0, -.57, 0]} castShadow><sphereGeometry args={[.3, 16, 12]}/><meshStandardMaterial color="#23bd99"/></mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * .43, -.4, 0]} rotation={[0, 0, side * .5]}><capsuleGeometry args={[.085, .28, 4, 8]}/><meshStandardMaterial color="#d8f5e9"/></mesh>)}
    <Box position={[0, .55, 0]} scale={[.045, .2, .045]} color="#aaff6f" glow/>
    <pointLight color="#8affd0" intensity={2} distance={3}/>
  </group>;
}
function CameraRig({ step, overview, reduced, onArrive }: Props) {
  const look = useRef(new THREE.Vector3());
  const done = useRef(false);
  useEffect(() => { done.current = false; }, [step, overview]);
  useFrame(({ camera }, dt) => {
    const p = points[step];
    const target = overview ? new THREE.Vector3(12, 12, 17) : new THREE.Vector3(p[0] + 5.8, 6.8, p[2] + 8);
    const focus = overview ? new THREE.Vector3(0, .4, 0) : new THREE.Vector3(p[0], .7, p[2]);
    const alpha = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
    camera.position.lerp(target, alpha); look.current.lerp(focus, alpha); camera.lookAt(look.current);
    if (!done.current && camera.position.distanceTo(target) < .065 && look.current.distanceTo(focus) < .065) { done.current = true; onArrive(); }
  });
  return null;
}
function City(props: Props & { low: boolean }) {
  return <>
    <color attach="background" args={['#0b172b']}/><fog attach="fog" args={['#0b172b', 22, 48]}/>
    <ambientLight intensity={1.25}/><hemisphereLight args={['#a5d8ff', '#25204c', 1.5]}/>
    <directionalLight position={[2, 12, 7]} intensity={3} castShadow={!props.low} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-10}/>
    <pointLight position={[-6, 4, -3]} color="#a675ff" intensity={35} distance={15}/><pointLight position={[5, 4, 4]} color="#33e4e0" intensity={25} distance={14}/>
    {points.slice(0, -1).map((p, i) => <Bridge key={i} a={p} b={points[i + 1]} lit={props.step > i}/>)}
    {points.map((p, i) => <group key={i} position={p}>
      <mesh position={[0, -.55, 0]} castShadow receiveShadow><cylinderGeometry args={[1.65, 1.1, 1.1, 6]}/><meshStandardMaterial color="#273d52" flatShading roughness={.75}/></mesh>
      <mesh position={[0, .035, 0]} receiveShadow><cylinderGeometry args={[1.65, 1.65, .14, 6]}/><meshStandardMaterial color={i <= props.step ? '#286e60' : '#274d54'} roughness={.65}/></mesh>
      <mesh position={[0, -.03, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.52, .025, 6, 6]}/><meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={i <= props.step ? 2 : .25}/></mesh>
      <Building x={-.48} z={-.35} height={i === 4 ? 1.9 : 1.2} color={['#61bd91', '#69bcce', '#9985d5', '#4ca7b7', '#b0ce77'][i]} growth={props.growth}/>
      <Building x={.5} z={-.5} height={.65} color="#298d81" growth={props.growth}/>
      {!props.low && <Building x={.65} z={.45} height={.9} color="#356b85" growth={props.growth}/ >}
      <mesh position={[-.65, .55, .65]} castShadow><coneGeometry args={[.32, .9, 6]}/><meshStandardMaterial color="#9cda65"/></mesh>
      <Box position={[-.65, .19, .65]} scale={[.09, .35, .09]} color="#79b6a4"/>
      <Coin position={[0, 1.8, .5]} reduced={props.reduced}/>
    </group>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow><planeGeometry args={[200, 200]}/><meshStandardMaterial color="#0b172b" roughness={1}/></mesh>
    <gridHelper args={[50, 50, '#193349', '#12263b']} position={[0, -1.97, 0]}/>
    <Robot {...props}/><CameraRig {...props}/>
  </>;
}
export default function Scene(props: Props) {
  const [quality] = useState(() => typeof navigator !== 'undefined' && (navigator.hardwareConcurrency <= 4 || window.innerWidth < 768));
  // Let the real renderer initialize its context. A separate probe can misreport
  // support, allocate an unused context, and cannot detect scene/import errors.
  // "default" also avoids requiring a discrete/high-performance GPU.
  const benchmark = benchmarkMode();
  const stable = benchmark ? { ...props, step: 0, overview: true, reduced: false, growth: .6, reaction: 1 } : props;
  return <Canvas shadows={!quality} dpr={benchmark ? 1 : quality ? 1 : [1, 1.5]} camera={{ position: [12, 12, 17], fov: 40 }} gl={{ antialias: !quality, powerPreference: 'default', failIfMajorPerformanceCaveat: false }} performance={{ min: .5 }} aria-label="شهر سه‌بعدی گرینو با پنج جزیره متصل"><City {...stable} low={quality}/><Benchmark/></Canvas>;
}
