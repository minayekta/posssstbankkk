"use client";

import { useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createCityModel, islandPoints, type CityModel } from './city-model';
import { Benchmark, benchmarkMode } from './benchmark';
import CompatibleCanvas from './compatible-canvas';

type Props = { step: number; overview: boolean; reduced: boolean; growth: number; reaction: number | null; onArrive: () => void; onUnavailable?: () => void; retry?: () => void };
function City({ step, overview, reduced, growth, reaction, onArrive, low, benchmark }: Props & { low: boolean; benchmark: boolean }) {
  const model = useMemo(() => createCityModel(low), [low]);
  const activeModel = useRef<CityModel | null>(null);
  const invalidate = useThree(state => state.invalidate);
  const tools = useMemo(() => ({ robotTarget: new THREE.Vector3(), cameraTarget: new THREE.Vector3(), focusTarget: new THREE.Vector3(), look: new THREE.Vector3(), transform: new THREE.Object3D() }), []);
  const arrived = useRef(false);
  const callback = useRef(onArrive);
  useEffect(() => { callback.current = onArrive; }, [onArrive]);
  useEffect(() => { arrived.current = false; }, [step, overview]);
  useEffect(() => { model.updatePaths(step); }, [model, step]);
  useEffect(() => {
    model.eyeMaterial.color.set(reaction === 0 ? '#bd9af7' : '#bff76b');
    model.eyeMaterial.emissive.copy(model.eyeMaterial.color);
  }, [model, reaction]);
  useEffect(() => { activeModel.current = model; return model.retain(); }, [model]);
  useEffect(() => { invalidate(); }, [invalidate, step, overview, reduced, growth, reaction]);
  useFrame(({ camera, clock, size }, delta) => {
    const model = activeModel.current;
    if (!model) return;
    const dt = Math.min(delta, .05);
    const time = clock.elapsedTime;
    const point = islandPoints[step];
    const alpha = reduced ? 1 : 1 - Math.exp(-dt * 2.7);
    const aspect = size.width / size.height;
    const distance = overview ? Math.max(1, 1.18 / aspect) : Math.max(1, .8 / aspect);
    tools.cameraTarget.set(overview ? 11 * distance : point[0] + 4.4 * distance, overview ? 10 * distance : 5.3 * distance, overview ? 15 * distance : point[2] + 6.8 * distance);
    const focusHeight = step === 4 ? 1.45 + Math.min(1.6, growth) * .2 : 1.05;
    tools.focusTarget.set(overview ? .3 : point[0], overview ? .5 : focusHeight + point[1], overview ? .1 : point[2]);
    if (benchmark) { tools.cameraTarget.set(12, 12, 17); tools.focusTarget.set(0, .4, 0); }
    camera.position.lerp(tools.cameraTarget, alpha); tools.look.lerp(tools.focusTarget, alpha); camera.lookAt(tools.look);
    if (!arrived.current && camera.position.distanceToSquared(tools.cameraTarget) < .004 && tools.look.distanceToSquared(tools.focusTarget) < .004) { arrived.current = true; callback.current(); }
    tools.robotTarget.set(point[0] + 1, point[1] + 2.3 + (reduced ? 0 : Math.sin(time * 2) * .12), point[2] + .9);
    model.robot.position.lerp(tools.robotTarget, reduced ? 1 : 1 - Math.exp(-dt * 2.4));
    model.robot.rotation.set(0, -.3 + (reduced ? 0 : Math.sin(time) * .13), reduced ? 0 : Math.sin(time * 1.5) * (reaction === 1 ? .09 : .025));
    model.eyes.scale.y = !reduced && time % 4 > 3.82 ? .12 : reaction === 1 ? 1.2 : 1;
    const targetGrowth = 1 + Math.min(1.6, growth) * .35;
    model.growth.scale.y = reduced ? targetGrowth : THREE.MathUtils.damp(model.growth.scale.y, targetGrowth, 3, dt);
    for (let i = 0; i < 5; i++) {
      const p = islandPoints[i];
      tools.transform.position.set(p[0] - .9, p[1] + 1.65 + (reduced ? 0 : Math.sin(time * 1.3 + i) * .1), p[2] + .55);
      tools.transform.rotation.set(Math.PI / 2, 0, reduced ? .3 : time * .5 + i);
      tools.transform.scale.set(.2, .065, .2); tools.transform.updateMatrix(); model.coins.setMatrixAt(i, tools.transform.matrix);
    }
    model.coins.instanceMatrix.needsUpdate = true;
  });
  return <primitive object={model.root} dispose={null}/>;
}
function AdaptiveQuality({ low, paused }: { low: boolean; paused: boolean }) {
  const setDpr = useThree(state => state.setDpr);
  const samples = useRef({ total: 0, count: 0, level: low ? 1 : Math.min(1.5, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1), lastChange: 0 });
  useFrame((state, delta) => {
    if (paused || document.hidden || delta > .2) return;
    const sample = samples.current;
    sample.total += delta; sample.count++;
    if (sample.count < 120 || state.clock.elapsedTime - sample.lastChange < 4) return;
    const average = sample.total / sample.count;
    const next = average > .023 ? Math.max(.75, sample.level - .25) : average < .0175 ? Math.min(low ? 1 : 1.5, devicePixelRatio, sample.level + .25) : sample.level;
    if (next !== sample.level) { sample.level = next; sample.lastChange = state.clock.elapsedTime; setDpr(next); }
    sample.total = 0; sample.count = 0;
  });
  return null;
}
function Scene(props: Props) {
  const [low] = useState(() => typeof navigator !== 'undefined' && (navigator.hardwareConcurrency <= 4 || window.innerWidth < 768));
  const [benchmark] = useState(benchmarkMode);
  const stable = benchmark ? { ...props, step: 0, overview: true, reduced: false, growth: .6, reaction: 1 } : props;
  return <CompatibleCanvas low={low} reduced={props.reduced} benchmark={!!benchmark} onUnavailable={props.onUnavailable} retry={props.retry}>
    <color attach="background" args={['#0b172b']}/><fog attach="fog" args={['#0b172b', 26, 52]}/>
    <ambientLight intensity={.7}/><hemisphereLight args={['#c9eaff', '#3b2750', 1.9]}/>
    <directionalLight position={[-3, 10, 7]} intensity={3.2} castShadow={!low} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-.0005} shadow-normalBias={.04} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={8} shadow-camera-bottom={-7} shadow-camera-far={24}/>
    <directionalLight position={[6, 5, -6]} color="#a38aff" intensity={1.8}/>
    {!low && <pointLight position={[3, 3, 4]} color="#43dbe2" intensity={12} distance={12} decay={2}/>}
    <City {...stable} low={low} benchmark={!!benchmark}/><AdaptiveQuality low={low} paused={!!benchmark}/><Benchmark/>
  </CompatibleCanvas>;
}
export default memo(Scene);
