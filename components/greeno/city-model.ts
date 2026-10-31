import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const islandPoints: [number, number, number][] = [[-5, 0, 1], [-2.5, .1, -2], [.8, .22, -.6], [4, .1, -2], [5.3, .35, 2.2]];
export const landmarkNames = ['سکوی هدف', 'بانک پس‌انداز', 'استودیوی مهارت', 'بازار کوچک', 'باغ فردا'];
const palette = { mint: '#52d9b0', lime: '#bcf56b', turquoise: '#4acfe0', violet: '#ad8be8', coral: '#fc987e', yellow: '#ffdb70', cream: '#e2f0e9', navy: '#193952', leaf: '#79c879' };
type V3 = [number, number, number];
type Shape = 'box' | 'cylinder' | 'sphere' | 'ring' | 'cone' | 'base';
type Style = 'solid' | 'light' | 'glass';
type Part = { matrix: THREE.Matrix4; color: THREE.Color };

/** Geometry and materials belong to one mounted scene, never the module cache. */
export function createCityModel(low: boolean) {
  let owners = 0;
  let disposed = false;
  const root = new THREE.Group();
  const growth = new THREE.Group();
  root.add(growth);
  const geometries: Record<Shape, THREE.BufferGeometry> = {
    box: new RoundedBoxGeometry(1, 1, 1, low ? 1 : 2, .09),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, low ? 16 : 28),
    sphere: new THREE.SphereGeometry(1, low ? 12 : 20, low ? 8 : 14),
    ring: new THREE.TorusGeometry(1, .055, 6, low ? 24 : 40),
    cone: new THREE.ConeGeometry(1, 1, 4),
    base: new THREE.CylinderGeometry(1, .76, 1, low ? 12 : 24),
  };
  const materials: Record<Style, THREE.MeshStandardMaterial> = {
    solid: new THREE.MeshStandardMaterial({ color: 'white', roughness: .48, metalness: .16 }),
    light: new THREE.MeshStandardMaterial({ color: 'white', emissive: '#9aeed3', emissiveIntensity: .5, roughness: .3, toneMapped: false }),
    glass: new THREE.MeshStandardMaterial({ color: 'white', roughness: .22, metalness: .46 }),
  };
  const dummy = new THREE.Object3D();
  function batcher(parent: THREE.Group) {
    const groups = new Map<string, { shape: Shape; style: Style; shadow: boolean; parts: Part[] }>();
    function add(shape: Shape, pos: V3, scale: V3, color: string, rotation: V3 = [0, 0, 0], style: Style = 'solid', shadow = false) {
      const key = `${shape}:${style}:${shadow}`;
      let group = groups.get(key);
      if (!group) { group = { shape, style, shadow, parts: [] }; groups.set(key, group); }
      dummy.position.set(...pos); dummy.scale.set(...scale); dummy.rotation.set(...rotation); dummy.updateMatrix();
      group.parts.push({ matrix: dummy.matrix.clone(), color: new THREE.Color(color) });
    }
    function finish() {
      for (const { shape, style, shadow, parts } of groups.values()) {
        const mesh = new THREE.InstancedMesh(geometries[shape], materials[style], parts.length);
        for (let i = 0; i < parts.length; i++) { mesh.setMatrixAt(i, parts[i].matrix); mesh.setColorAt(i, parts[i].color); }
        mesh.castShadow = !low && shadow;
        mesh.receiveShadow = style !== 'light';
        mesh.computeBoundingSphere();
        parent.add(mesh);
      }
    }
    return { add, finish };
  }
  const city = batcher(root);
  const add = city.add;
  function windows(x: number, z: number, y: number, rows: number, width: number, color: string) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < (low ? 2 : 3); col++) {
        add('box', [x + (col - (low ? .5 : 1)) * width / 3, y + row * .27, z], [width / 4.5, .09, .035], color, [0, 0, 0], 'light');
      }
    }
  }
  function tree(x: number, y: number, z: number, color: string) {
    add('cylinder', [x, y + .18, z], [.045, .34, .045], '#577c72');
    add('sphere', [x, y + .58, z], [.24, .34, .24], color);
    add('cylinder', [x, y + .04, z], [.23, .12, .23], palette.cream);
  }
  function sign(x: number, y: number, z: number, color: string, icon: number) {
    add('box', [x, y, z], [.75, .3, .09], palette.navy);
    // A simple geometric sign: legible silhouettes without font/text textures.
    for (let k = 0; k <= icon; k++) add('box', [x - .22 + k * .15, y, z + .055], [.08, .1, .015], color, [0, 0, 0], 'light');
  }
  islandPoints.forEach(([x, y, z], index) => {
    const accent = [palette.yellow, palette.lime, palette.violet, palette.coral, palette.turquoise][index];
    add('base', [x, y - .52, z], [1.55, 1, 1.45], '#284457', [0, index * .3, 0], 'solid', true);
    add('cylinder', [x, y + .015, z], [1.55, .14, 1.45], index === 3 ? '#39665c' : '#32796b');
    add('ring', [x, y + .07, z], [1.5, 1.4, 1], accent, [-Math.PI / 2, 0, 0], 'light');
    for (let k = 0; k < (low ? 2 : 4); k++) {
      const angle = Math.PI * (.25 + k * .45);
      tree(x + Math.cos(angle) * 1.12, y + .08, z + Math.sin(angle) * 1.04, k % 2 ? palette.mint : palette.leaf);
    }
    // A small raised garden and a luminous station marker.
    add('box', [x - .75, y + .14, z + .65], [.5, .15, .35], palette.navy);
    add('sphere', [x - .75, y + .28, z + .65], [.25, .15, .15], accent);
    sign(x, y + .38, z + 1.1, accent, index);
  });
  // 1 · Goal deck: coral stairs, a large yellow target and a flag.
  {
    const [x, y, z] = islandPoints[0];
    add('cylinder', [x, y + .25, z], [.83, .35, .78], palette.coral, [0, 0, 0], 'solid', true);
    add('cylinder', [x, y + .47, z], [.6, .12, .58], palette.cream);
    add('box', [x, y + .9, z - .12], [.13, .9, .13], palette.turquoise);
    for (let r = 0; r < 3; r++) add('ring', [x, y + 1.45, z], [.57 - r * .18, .57 - r * .18, 1], r % 2 ? palette.coral : palette.yellow, [0, 0, 0], 'light');
    add('sphere', [x, y + 1.45, z], [.09, .09, .09], palette.cream);
    add('box', [x + .73, y + 1.15, z - .35], [.035, 1.8, .035], palette.cream);
    add('box', [x + .97, y + 1.9, z - .35], [.48, .3, .035], palette.lime);
    for (let k = 0; k < 3; k++) add('box', [x - .65 + k * .23, y + .1 + k * .09, z + .53], [.28, .17 + k * .1, .45], palette.violet);
  }
  // 2 · Savings bank: rounded green shell, vault dial and roof garden.
  {
    const [x, y, z] = islandPoints[1];
    add('box', [x, y + .82, z - .1], [1.65, 1.45, 1.14], palette.cream, [0, 0, 0], 'solid', true);
    add('box', [x, y + 1.59, z - .1], [1.85, .2, 1.3], palette.mint);
    add('box', [x, y + .82, z + .49], [1.35, 1.1, .08], palette.mint);
    add('cylinder', [x, y + .84, z + .58], [.43, .1, .43], '#224d58', [Math.PI / 2, 0, 0], 'glass');
    add('ring', [x, y + .84, z + .65], [.34, .34, 1], palette.yellow, [0, 0, 0], 'light');
    for (let k = 0; k < 4; k++) add('box', [x, y + .84, z + .69], [.46, .045, .06], palette.cream, [0, 0, Math.PI * k / 4]);
    add('sphere', [x, y + .84, z + .74], [.1, .1, .06], palette.yellow);
    sign(x, y + 1.87, z + .25, palette.lime, 1);
    windows(x, z - .68, y + .5, 3, 1.1, palette.turquoise);
    tree(x + .5, y + 1.7, z - .25, palette.lime);
  }
  // 3 · Skill studio: split lavender volumes, screen and orbital antenna.
  {
    const [x, y, z] = islandPoints[2];
    add('box', [x - .3, y + .75, z], [.85, 1.35, 1], palette.violet, [0, -.18, 0], 'solid', true);
    add('box', [x + .43, y + 1.05, z - .18], [.7, 1.95, .86], palette.turquoise, [0, .15, 0], 'solid', true);
    add('box', [x - .3, y + .9, z + .54], [.66, .72, .07], palette.navy);
    add('box', [x - .3, y + .93, z + .59], [.4, .07, .025], palette.coral, [0, 0, .6], 'light');
    add('box', [x - .3, y + 1.48, z], [1.05, .12, 1.12], palette.yellow);
    add('ring', [x + .43, y + 2.22, z - .18], [.42, .42, .42], palette.violet, [.6, .2, .2], 'light');
    add('sphere', [x + .43, y + 2.22, z - .18], [.13, .13, .13], palette.yellow);
    windows(x + .43, z + .28, y + .5, low ? 3 : 5, .5, palette.cream);
    sign(x - .3, y + .3, z + .63, palette.violet, 2);
  }
  // 4 · Neighborhood market: coral awnings, striped counters and little stalls.
  {
    const [x, y, z] = islandPoints[3];
    for (let k = 0; k < 2; k++) {
      const sx = x - .58 + k * 1.08;
      add('box', [sx, y + .48, z], [.82, .75, .86], k ? palette.yellow : palette.turquoise, [0, 0, 0], 'solid', true);
      add('cone', [sx, y + 1.16, z], [.79, .62, .69], k ? palette.violet : palette.coral, [0, Math.PI / 4, 0], 'solid', true);
      add('box', [sx, y + .72, z + .5], [.95, .12, .4], palette.cream);
      for (let n = 0; n < 3; n++) add('sphere', [sx + (n - 1) * .22, y + .83, z + .53], [.08, .09, .08], n % 2 ? palette.coral : palette.lime);
      add('box', [sx, y + .62, z + .53], [.68, .07, .03], palette.coral, [0, 0, 0], 'light');
    }
    sign(x, y + 1.63, z, palette.coral, 3);
  }
  // 5 · Tomorrow garden: savings scale this one batched district from its base.
  growth.position.set(...islandPoints[4]);
  const future = batcher(growth);
  for (let k = 0; k < 3; k++) {
    const x = (k - 1) * .65;
    const height = [1.2, 2.4, 1.7][k];
    future.add('box', [x, .12 + height / 2, k === 1 ? -.25 : .15], [.55, height, .66], [palette.coral, palette.mint, palette.violet][k], [0, 0, 0], 'solid', true);
    future.add('box', [x, height + .17, k === 1 ? -.25 : .15], [.67, .12, .77], palette.yellow);
    for (let row = 0; row < (low ? 3 : 5); row++) future.add('box', [x, .4 + row * (height - .3) / 5, k === 1 ? .1 : .5], [.34, .075, .025], palette.cream, [0, 0, 0], 'light');
  }
  future.add('ring', [0, 2.95, -.25], [.48, .2, .48], palette.turquoise, [-Math.PI / 2, 0, 0], 'light');
  future.finish();
  city.finish();

  // Bridges and their rails are one instanced draw per geometry/material.
  const bridges = batcher(root);
  const railMaterial = materials.light.clone();
  const rails = new THREE.InstancedMesh(geometries.box, railMaterial, 8);
  const railMatrices: THREE.Matrix4[] = [];
  const hiddenRail = new THREE.Matrix4().makeScale(0, 0, 0);
  const darkRail = new THREE.Color('#234750');
  const brightRail = new THREE.Color(palette.lime);
  for (let i = 0; i < 4; i++) {
    const a = islandPoints[i], b = islandPoints[i + 1];
    const angle = -Math.atan2(b[2] - a[2], b[0] - a[0]);
    const length = Math.hypot(b[0] - a[0], b[2] - a[2]);
    const y = (a[1] + b[1]) / 2;
    bridges.add('box', [(a[0] + b[0]) / 2, y + .04, (a[2] + b[2]) / 2], [length, .12, .37], '#31576b', [0, angle, 0]);
    for (let side = 0; side < 2; side++) {
      const offset = side ? .2 : -.2;
      dummy.position.set((a[0] + b[0]) / 2 + Math.sin(angle) * offset, y + .14, (a[2] + b[2]) / 2 + Math.cos(angle) * offset);
      dummy.scale.set(length, .035, .035); dummy.rotation.set(0, angle, 0); dummy.updateMatrix();
      railMatrices.push(dummy.matrix.clone());
      bridges.add('box', [dummy.position.x, dummy.position.y, dummy.position.z], [length, .035, .035], '#315363', [0, angle, 0]);
      rails.setMatrixAt(i * 2 + side, hiddenRail); rails.setColorAt(i * 2 + side, darkRail);
    }
  }
  rails.computeBoundingSphere(); root.add(rails); bridges.finish();
  const coinMaterial = new THREE.MeshStandardMaterial({ color: palette.yellow, metalness: .65, roughness: .24, emissive: '#c7b043', emissiveIntensity: .15 });
  const coins = new THREE.InstancedMesh(geometries.cylinder, coinMaterial, 5);
  coins.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  coins.frustumCulled = false; // Five small animated coins, bounded by the islands.
  root.add(coins);

  const robot = new THREE.Group();
  const body = batcher(robot);
  body.add('sphere', [0, 0, 0], [.43, .39, .34], palette.cream);
  body.add('box', [0, .015, .3], [.57, .25, .1], palette.navy);
  body.add('sphere', [0, -.47, 0], [.25, .28, .22], palette.mint);
  body.add('cylinder', [0, .47, 0], [.022, .16, .022], palette.violet);
  body.add('sphere', [0, .57, 0], [.065, .065, .065], palette.yellow, [0, 0, 0], 'light');
  for (const side of [-1, 1]) body.add('box', [side * .38, -.35, 0], [.12, .3, .15], palette.cream, [0, 0, side * .4]);
  body.finish();
  const eyes = new THREE.Group();
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: palette.lime, emissive: palette.lime, emissiveIntensity: .7 });
  const eyeMesh = new THREE.InstancedMesh(geometries.box, eyeMaterial, 2);
  for (let i = 0; i < 2; i++) { dummy.position.set(i ? .14 : -.14, .035, .36); dummy.scale.set(.075, .09, .02); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); eyeMesh.setMatrixAt(i, dummy.matrix); }
  eyes.add(eyeMesh); robot.add(eyes); robot.position.set(-4, 2, 2); root.add(robot);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(24, 48), new THREE.MeshStandardMaterial({ color: '#0c1b2d', roughness: .9 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.6; ground.receiveShadow = !low; root.add(ground);

  const model = {
    root, growth, robot, eyes, eyeMaterial, coins, rails, darkRail, brightRail,
    updatePaths(step: number) {
      for (let i = 0; i < 8; i++) {
        rails.setColorAt(i, i < step * 2 ? brightRail : darkRail);
        rails.setMatrixAt(i, i < step * 2 ? railMatrices[i] : hiddenRail);
      }
      if (rails.instanceColor) rails.instanceColor.needsUpdate = true;
      rails.instanceMatrix.needsUpdate = true;
      rails.computeBoundingSphere();
    },
    retain() {
      owners++;
      return () => { owners--; queueMicrotask(() => { if (owners === 0) model.dispose(); }); };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      const geometrySet = new Set<THREE.BufferGeometry>(Object.values(geometries));
      const materialSet = new Set<THREE.Material>([...Object.values(materials), railMaterial, coinMaterial, eyeMaterial]);
      root.traverse(object => { if (object instanceof THREE.Mesh) { geometrySet.add(object.geometry); for (const m of Array.isArray(object.material) ? object.material : [object.material]) materialSet.add(m); if (object instanceof THREE.InstancedMesh) object.dispose(); } });
      for (const geometry of geometrySet) geometry.dispose();
      for (const material of materialSet) material.dispose();
      root.clear();
    },
  };
  return model;
}
export type CityModel = ReturnType<typeof createCityModel>;
