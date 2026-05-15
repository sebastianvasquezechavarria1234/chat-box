'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Color } from 'three';
import type { Mesh, Points, Group } from 'three';

const palette = [
  { c: '#7c3aed', e: '#4f46e5' },
  { c: '#ec4899', e: '#db2777' },
  { c: '#06b6d4', e: '#0891b2' },
  { c: '#f59e0b', e: '#d97706' },
  { c: '#10b981', e: '#059669' },
  { c: '#3b82f6', e: '#2563eb' },
  { c: '#f472b6', e: '#e11d48' },
  { c: '#8b5cf6', e: '#7c3aed' },
];

function OrbitingRing({ radius, tube, color, opacity, rotSpeed, tilt }: {
  radius: number; tube: number; color: string; opacity: number; rotSpeed: number; tilt: [number, number, number];
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.003 * rotSpeed;
    ref.current.rotation.z += 0.002 * rotSpeed;
  });

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, tube, 24, 80]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Particles({ count = 120, radius = 1.9 }: { count?: number; radius?: number }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 0.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    ref.current.rotation.x = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c4b5fd"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={2}
      />
    </points>
  );
}

function GlowSphere({ color }: { color: string }) {
  const ref = useRef<Mesh>(null);
  const colRef = useRef(new Color(color));

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const s = 1.25 + Math.sin(t * 1.5) * 0.1;
    ref.current.scale.setScalar(s);
    ((ref.current.material as any).opacity) = 0.12 + Math.sin(t * 2) * 0.05;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={2}
        blending={2}
        depthWrite={false}
      />
    </mesh>
  );
}

function WireframeOverlay() {
  const ref = useRef<Mesh>(null);
  const colorRef = useRef(new Color('#a78bfa'));

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.15;
    ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    ((ref.current.material as any).opacity) = 0.15 + Math.sin(clock.getElapsedTime() * 1.8) * 0.08;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.02, 20, 20]} />
      <meshBasicMaterial
        wireframe
        color="#c4b5fd"
        transparent
        opacity={0.2}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbMesh() {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<any>(null);
  const groupRef = useRef<Group>(null);
  const targetColor = useRef(new Color('#7c3aed'));
  const targetEmissive = useRef(new Color('#4f46e5'));
  const mouseTarget = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current || !groupRef.current) return;

    const t = clock.getElapsedTime();
    const idx = Math.floor(t * 0.25) % palette.length;
    const target = palette[idx];

    targetColor.current.set(target.c);
    targetEmissive.current.set(target.e);

    matRef.current.color.lerp(targetColor.current, 0.035);
    matRef.current.emissive.lerp(targetEmissive.current, 0.035);
    matRef.current.emissiveIntensity = 0.25 + Math.sin(t * 1.3) * 0.2;
    matRef.current.distort = 0.2 + Math.sin(t * 2.5) * 0.15;

    const mx = mouseTarget.current.x;
    const my = mouseTarget.current.y;

    smoothMouse.current.x += (mx - smoothMouse.current.x) * 0.08;
    smoothMouse.current.y += (my - smoothMouse.current.y) * 0.08;

    const smx = smoothMouse.current.x;
    const smy = smoothMouse.current.y;

    groupRef.current.rotation.x = smy * 1.2;
    groupRef.current.rotation.y = smx * 1.2;
    groupRef.current.rotation.z = smx * smy * 0.3;

    ref.current.scale.x = 1 + smx * 0.15 + Math.abs(smx) * 0.1;
    ref.current.scale.y = 1 - Math.abs(smx) * 0.1 + smy * 0.12;
    ref.current.scale.z = 1 - Math.abs(smx) * 0.08;

    groupRef.current.position.y = Math.sin(t * 1.8) * 0.06 + smy * 0.1;
    groupRef.current.position.x = Math.sin(t * 0.7) * 0.03 + smx * 0.1;
  });

  return (
    <group ref={groupRef}>
      <GlowSphere color="#7c3aed" />
      <Sphere ref={ref} args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={matRef}
          color="#7c3aed"
          emissive="#4f46e5"
          emissiveIntensity={0.4}
          roughness={0.08}
          metalness={0.35}
          distort={0.25}
          speed={2}
          radius={1.2}
        />
      </Sphere>
      <WireframeOverlay />
      <OrbitingRing radius={1.4} tube={0.015} color="#a78bfa" opacity={0.35} rotSpeed={1} tilt={[Math.PI / 2, 0, 0]} />
      <OrbitingRing radius={1.55} tube={0.012} color="#06b6d4" opacity={0.25} rotSpeed={-0.7} tilt={[0.3, 0.5, 0.8]} />
      <OrbitingRing radius={1.7} tube={0.008} color="#ec4899" opacity={0.2} rotSpeed={0.5} tilt={[0.8, 0.2, 1.2]} />
      <Particles count={150} radius={1.9} />
    </group>
  );
}

export default function AIOrb() {
  return (
    <div className="w-28 h-28 relative mb-8">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#06b6d4" />
        <directionalLight position={[0, 5, 0]} intensity={0.3} />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
