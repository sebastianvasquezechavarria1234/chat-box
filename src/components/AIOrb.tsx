'use client';

import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Color, Vector2 } from 'three';
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
      <torusGeometry args={[radius, tube, 32, 80]} />
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
        depthWrite={false}
      />
    </points>
  );
}

function GlowSphere() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const s = 1.3 + Math.sin(t * 1.5) * 0.08;
    ref.current.scale.setScalar(s);
    ((ref.current.material as any).opacity) = 0.1 + Math.sin(t * 2) * 0.04;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.12}
        side={2}
        blending={2}
        depthWrite={false}
      />
    </mesh>
  );
}

function WireframeOverlay() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.12;
    ref.current.rotation.y = clock.getElapsedTime() * 0.18;
    ((ref.current.material as any).opacity) = 0.12 + Math.sin(clock.getElapsedTime() * 1.8) * 0.06;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.02, 20, 20]} />
      <meshBasicMaterial
        wireframe
        color="#c4b5fd"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  );
}

function PulseRing({ active, onComplete }: { active: number; onComplete: () => void }) {
  const ref = useRef<Mesh>(null);
  const progress = useRef(0);

  useEffect(() => {
    if (active > 0) progress.current = 0.001;
  }, [active]);

  useFrame(() => {
    if (!ref.current || progress.current <= 0) return;
    progress.current += 0.02;
    const p = progress.current;
    ref.current.scale.setScalar(1 + p * 4);
    ((ref.current.material as any).opacity) = Math.max(0, 1 - p * 2);
    if (p > 1.5) { progress.current = 0; onComplete(); }
  });

  if (progress.current <= 0) return null;

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.85, 1.15, 64]} />
      <meshBasicMaterial color="#c4b5fd" transparent opacity={1} side={2} depthWrite={false} blending={2} />
    </mesh>
  );
}

function SparkField() {
  const ref = useRef<Points>(null);
  const sparkData = useRef<Float32Array | null>(null);
  const sparkActive = useRef(false);
  const lastColorIdx = useRef(0);
  const sparkTime = useRef(0);

  const basePositions = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = Math.cos(phi);
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    const vel = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.02 + Math.random() * 0.04;
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return vel;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    const idx = Math.floor(t * 0.25) % palette.length;

    if (idx !== lastColorIdx.current) {
      lastColorIdx.current = idx;
      sparkActive.current = true;
      sparkTime.current = 0;
      sparkData.current = new Float32Array(basePositions);
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 80 * 3; i++) {
        pos[i] = basePositions[i];
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }

    if (sparkActive.current && sparkData.current) {
      sparkTime.current += 0.02;
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 80; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ((ref.current.material as any).opacity) = Math.max(0, 1 - sparkTime.current * 3);
      if (sparkTime.current > 0.5) {
        sparkActive.current = false;
      }
    } else if (!sparkActive.current) {
      ((ref.current.material as any).opacity) = 0;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={80}
          array={basePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#e8d4ff"
        transparent
        opacity={0}
        blending={2}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function CameraOrbit({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.04) * 0.1;
  });

  return <group ref={groupRef}>{children}</group>;
}

function OrbMesh({ onPulse }: { onPulse: () => void }) {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<any>(null);
  const groupRef = useRef<Group>(null);
  const targetColor = useRef(new Color('#7c3aed'));
  const targetEmissive = useRef(new Color('#4f46e5'));
  const mouseTarget = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const springPos = useRef({ x: 0, y: 0 });
  const smoothColor = useRef(new Color('#7c3aed'));

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

    const stiffness = 0.12;
    const damping = 0.78;

    const mx = mouseTarget.current.x;
    const my = mouseTarget.current.y;

    velocity.current.x += (mx - springPos.current.x) * stiffness;
    velocity.current.y += (my - springPos.current.y) * stiffness;
    velocity.current.x *= damping;
    velocity.current.y *= damping;
    springPos.current.x += velocity.current.x;
    springPos.current.y += velocity.current.y;

    const smx = springPos.current.x;
    const smy = springPos.current.y;

    smoothColor.current.lerp(targetColor.current, 0.04);

    matRef.current.color.lerp(smoothColor.current, 0.03);
    matRef.current.emissive.lerp(targetEmissive.current, 0.03);
    matRef.current.emissiveIntensity = 0.2 + Math.sin(t * 1.3) * 0.15;
    matRef.current.distort = 0.18 + Math.sin(t * 2.5 + smx * 0.5) * 0.12;
    matRef.current.roughness = 0.06 + Math.sin(t * 0.7) * 0.04;

    groupRef.current.rotation.x = smy * 1.2;
    groupRef.current.rotation.y = smx * 1.2;
    groupRef.current.rotation.z = smx * smy * 0.25;

    ref.current.scale.x = 1 + smx * 0.12 + velocity.current.x * 0.15;
    ref.current.scale.y = 1 - Math.abs(smx) * 0.08 + smy * 0.1 + velocity.current.y * 0.12;

    groupRef.current.position.y = Math.sin(t * 1.8) * 0.05 + smy * 0.08;
    groupRef.current.position.x = Math.sin(t * 0.7) * 0.02 + smx * 0.08;
  });

  return (
    <group ref={groupRef} onClick={onPulse}>
      <GlowSphere />
      <Sphere ref={ref} args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={matRef}
          color="#7c3aed"
          emissive="#4f46e5"
          emissiveIntensity={0.4}
          roughness={0.08}
          metalness={0.4}
          distort={0.25}
          speed={2}
          radius={1.2}
          envMapIntensity={0.6}
        />
      </Sphere>
      <WireframeOverlay />
      <OrbitingRing radius={1.35} tube={0.025} color="#a78bfa" opacity={0.6} rotSpeed={1} tilt={[Math.PI / 2, 0, 0]} />
      <OrbitingRing radius={1.5} tube={0.02} color="#2dd4bf" opacity={0.5} rotSpeed={-0.7} tilt={[0.3, 0.5, 0.8]} />
      <OrbitingRing radius={1.7} tube={0.015} color="#f472b6" opacity={0.4} rotSpeed={0.5} tilt={[0.8, 0.2, 1.2]} />
      <Particles count={120} radius={1.85} />
      <SparkField />
    </group>
  );
}

export default function AIOrb() {
  const [pulseCount, setPulseCount] = useState(0);
  const [pulseDone, setPulseDone] = useState(true);
  const [pulseKey, setPulseKey] = useState(0);

  const handlePulse = useCallback(() => {
    setPulseCount(prev => prev + 1);
    setPulseKey(prev => prev + 1);
    setPulseDone(false);
  }, []);

  const handlePulseComplete = useCallback(() => {
    setPulseDone(true);
  }, []);

  return (
    <div className="w-28 h-28 relative mb-6 cursor-pointer" onClick={handlePulse}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#06b6d4" />
        <directionalLight position={[0, 5, 0]} intensity={0.4} />
        <CameraOrbit>
          <OrbMesh onPulse={handlePulse} />
          {!pulseDone && <PulseRing key={pulseKey} active={pulseCount} onComplete={handlePulseComplete} />}
        </CameraOrbit>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={4} blur={2.5} far={2} />
        <Environment preset="city" />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.6} />
          <ChromaticAberration offset={new Vector2(0.001, 0.001)} radialModulation={false} modulationOffset={0.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
