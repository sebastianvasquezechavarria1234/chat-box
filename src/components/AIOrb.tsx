'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uVelocity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vWorldPosition;

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

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    float noise = snoise(position * 1.5 + uTime * 0.5);
    vNoise = noise;

    float distortionStrength = 0.18 + uVelocity * 1.2;
    vec3 displaced = position + normal * noise * distortionStrength;

    vPosition = displaced;
    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uLight1Pos;
  uniform vec3 uLight1Color;
  uniform vec3 uLight2Pos;
  uniform vec3 uLight2Color;
  uniform vec3 uLight3Pos;
  uniform vec3 uLight3Color;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vWorldPosition;

  void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(vec3(0.0, 0.0, 3.0) - vWorldPosition);

    vec3 lightDir1 = normalize(uLight1Pos - vWorldPosition);
    float diff1 = max(dot(norm, lightDir1), 0.0);
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    float spec1 = pow(max(dot(norm, halfDir1), 0.0), 64.0);

    vec3 lightDir2 = normalize(uLight2Pos - vWorldPosition);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec2 = pow(max(dot(norm, halfDir2), 0.0), 64.0);

    vec3 lightDir3 = normalize(uLight3Pos - vWorldPosition);
    float diff3 = max(dot(norm, lightDir3), 0.0);
    vec3 halfDir3 = normalize(lightDir3 + viewDir);
    float spec3 = pow(max(dot(norm, halfDir3), 0.0), 64.0);

    vec3 purpleBase = vec3(0.486, 0.227, 0.929);
    vec3 pinkAccent = vec3(0.91, 0.3, 0.6);

    float noiseFactor = smoothstep(-0.2, 0.8, vNoise);
    vec3 baseColor = mix(purpleBase, pinkAccent, noiseFactor * 0.7);

    vec3 diffuse = baseColor * (diff1 * uLight1Color + diff2 * uLight2Color + diff3 * uLight3Color) * 0.4;
    vec3 specular = (spec1 * uLight1Color + spec2 * uLight2Color + spec3 * uLight3Color) * 0.5;
    vec3 ambient = baseColor * 0.15;

    vec3 fresnel = mix(purpleBase, pinkAccent, 0.5) * pow(1.0 - max(dot(viewDir, norm), 0.0), 3.0) * 0.6;

    vec3 color = ambient + diffuse + specular + fresnel;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function MetalSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uLight1Pos: { value: new THREE.Vector3(5, 5, 5) },
      uLight1Color: { value: new THREE.Vector3(1, 1, 1) },
      uLight2Pos: { value: new THREE.Vector3(-5, -5, -5) },
      uLight2Color: { value: new THREE.Vector3(0.486, 0.227, 0.929) },
      uLight3Pos: { value: new THREE.Vector3(0, 0, 0) },
      uLight3Color: { value: new THREE.Vector3(0.486, 0.227, 0.929) },
    }),
    []
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    window.addEventListener('mousemove', handleMouseMove);

    const dx = mouse.current.x - prevMouse.current.x;
    const dy = mouse.current.y - prevMouse.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    velocity.current = velocity.current * 0.8 + speed * 0.2;

    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uVelocity.value = velocity.current;

    targetRotation.current.y = mouse.current.x * 1.2;
    targetRotation.current.x = mouse.current.y * 1.2;

    const baseRotY = clock.getElapsedTime() * 0.3;
    const baseRotX = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;

    meshRef.current.rotation.y += (targetRotation.current.y + baseRotY - meshRef.current.rotation.y) * 0.08;
    meshRef.current.rotation.x += (targetRotation.current.x + baseRotX - meshRef.current.rotation.x) * 0.08;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={150} color="#7c3aed" distance={4} />
    </group>
  );
}

function OrbitingParticles({ count = 80, radius = 2.0 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 0.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.04 + Math.random() * 0.08;
      op[i] = 0.5 + Math.random() * 0.5;
    }
    return [pos, sz, op];
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <group>
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
          size={0.12}
          color="#a78bfa"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color="#7c3aed"
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color="#5b21b6"
          transparent
          opacity={0.12}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </points>
    </group>
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
  return (
    <div className={`${sizeClasses[size]} relative`}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={150} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={150} color="#7c3aed" />
        <MetalSphere />
        <OrbitingParticles count={80} radius={2.2} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
