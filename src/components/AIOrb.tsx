'use client';

import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import * as THREE from 'three';

const noiseFunctions = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
`;

function MetalSphere({ onHover }: { onHover: (v: number) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const shaderRef = useRef<THREE.Shader>();
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const hoverValue = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging.current) {
      const dx = mouse.current.x - dragStart.current.x;
      const dy = mouse.current.y - dragStart.current.y;
      targetRotation.current.y += dx * 2;
      targetRotation.current.x += dy * 2;
      dragStart.current.x = mouse.current.x;
      dragStart.current.y = mouse.current.y;
    }
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    dragStart.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    dragStart.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const dx = mouse.current.x - prevMouse.current.x;
    const dy = mouse.current.y - prevMouse.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    velocity.current = velocity.current * 0.8 + speed * 0.2;

    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uVelocity.value = velocity.current;
      hoverValue.current += (0 - hoverValue.current) * 0.1;
      shaderRef.current.uniforms.uHover.value = hoverValue.current;
    }

    if (!isDragging.current) {
      targetRotation.current.y = mouse.current.x * 1.2;
      targetRotation.current.x = mouse.current.y * 1.2;

      const baseRotY = clock.getElapsedTime() * 0.3;
      const baseRotX = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;

      meshRef.current.rotation.y += (targetRotation.current.y + baseRotY - meshRef.current.rotation.y) * 0.08;
      meshRef.current.rotation.x += (targetRotation.current.x + baseRotX - meshRef.current.rotation.x) * 0.08;
    } else {
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.15;
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.15;
    }
  });

  const onBeforeCompile = useCallback((shader: THREE.Shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uVelocity = { value: 0 };
    shader.uniforms.uHover = { value: 0 };
    shaderRef.current = shader;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uVelocity;
      uniform float uHover;
      varying float vNoise;
      ${noiseFunctions}
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      float noise1 = snoise(position * 1.5 + uTime * 0.5);
      float noise2 = fbm(position * 2.0 + uTime * 0.3);
      vNoise = noise1;

      float distortionStrength = 0.18 + uVelocity * 1.2;
      transformed = position + objectNormal * (noise1 * 0.7 + noise2 * 0.3) * distortionStrength;
      
      float scale = 1.0 + uHover * 0.15;
      transformed *= scale;
      `
    );

    shader.fragmentShader = `
      varying float vNoise;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.91, 0.3, 0.6), smoothstep(-0.2, 0.8, vNoise) * 0.6);
      `
    );
  }, []);

  return (
    <group>
      <mesh 
        ref={meshRef}
        onPointerEnter={() => { hoverValue.current = 1; onHover(1); }}
        onPointerLeave={() => { hoverValue.current = 0; onHover(0); isDragging.current = false; }}
      >
        <sphereGeometry args={[1.2, 128, 128]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#4822e1"
          emissive="#1a0b40"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          iridescence={1.0}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 400]}
          transmission={0.2}
          thickness={1.5}
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </group>
  );
}

function OrbitingParticles({ count = 80, radius = 2.0, mousePos }: { count?: number; radius?: number; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => {
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
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;

    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      const mx = (mousePos.current?.x ?? 0) * 0.3;
      const my = (mousePos.current?.y ?? 0) * 0.3;

      const dx = mx - bx;
      const dy = my - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 3) * 0.4;

      positions[i * 3] = bx + dx * influence;
      positions[i * 3 + 1] = by + dy * influence;
      positions[i * 3 + 2] = bz + Math.sin(t * 2 + i) * 0.05;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={basePositions.slice()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#7c3aed"
        sizeAttenuation
      />
    </points>
  );
}

function ParticleStorm({ active, mousePos }: { active: boolean; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const time = useRef(0);

  const [positions, velocities] = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.02 + Math.random() * 0.04;
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    if (active) {
      time.current += 0.02;
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      (ref.current.material as THREE.PointsMaterial).opacity = Math.min(1, time.current * 3);
    } else {
      time.current = 0;
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      (ref.current.material as THREE.PointsMaterial).opacity = 0;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={60}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#a78bfa"
        transparent
        opacity={0}
        sizeAttenuation
        blending={2}
        depthWrite={false}
      />
    </points>
  );
}

type OrbSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<OrbSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-28 h-28 mb-6',
  lg: 'w-40 h-40',
};

interface AIOrbProps {
  size?: OrbSize;
}

export default function AIOrb({ size = 'md' }: AIOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  return (
    <div
      className={`${sizeClasses[size]} relative`}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
        onPointerMove={(e: any) => {
          if (e?.point) {
            mousePos.current.x = e.point.x;
            mousePos.current.y = e.point.y;
          }
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={50} color="#7c3aed" />
        
        <MetalSphere onHover={(v) => setIsHovered(v === 1)} />
        <OrbitingParticles count={80} radius={2.2} mousePos={mousePos} />
        <ParticleStorm active={isHovered} mousePos={mousePos} />
        
        {/* Aquí es donde el Environment hace toda la magia PBR */}
        <Environment preset="city" />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} />
          <ChromaticAberration offset={new Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0.2} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
