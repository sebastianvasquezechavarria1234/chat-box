'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Color } from 'three';
import type { Mesh } from 'three';

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

function OrbMesh() {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<any>(null);
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
    if (!ref.current || !matRef.current) return;

    const t = clock.getElapsedTime();
    const idx = Math.floor(t * 0.25) % palette.length;
    const target = palette[idx];

    targetColor.current.set(target.c);
    targetEmissive.current.set(target.e);

    matRef.current.color.lerp(targetColor.current, 0.035);
    matRef.current.emissive.lerp(targetEmissive.current, 0.035);
    matRef.current.emissiveIntensity = 0.25 + Math.sin(t * 1.3) * 0.2;
    matRef.current.distort = 0.18 + Math.sin(t * 2.5) * 0.12;

    const mx = mouseTarget.current.x;
    const my = mouseTarget.current.y;

    smoothMouse.current.x += (mx - smoothMouse.current.x) * 0.08;
    smoothMouse.current.y += (my - smoothMouse.current.y) * 0.08;

    const smx = smoothMouse.current.x;
    const smy = smoothMouse.current.y;

    ref.current.rotation.x = smy * 1.2;
    ref.current.rotation.y = smx * 1.2;
    ref.current.rotation.z = smx * smy * 0.3;

    ref.current.scale.x = 1 + smx * 0.15 + Math.abs(smx) * 0.1;
    ref.current.scale.y = 1 - Math.abs(smx) * 0.1 + smy * 0.12;
    ref.current.scale.z = 1 - Math.abs(smx) * 0.08;

    ref.current.position.y = Math.sin(t * 1.8) * 0.06 + smy * 0.1;
    ref.current.position.x = Math.sin(t * 0.7) * 0.03 + smx * 0.1;
  });

  return (
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
  );
}

export default function AIOrb() {
  return (
    <div className="w-24 h-24 relative mb-8">
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
