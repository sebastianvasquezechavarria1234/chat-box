'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 viewDir = normalize(vec3(0.0, 0.0, 3.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);

    vec3 baseColor = vec3(0.15, 0.15, 0.18);
    vec3 ambient = baseColor * 0.3;
    vec3 diffuse = baseColor * diff * 0.6;
    vec3 specular = vec3(1.0) * spec * 0.8;

    vec3 fresnel = vec3(0.4, 0.45, 0.5) * pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    vec3 color = ambient + diffuse + specular + fresnel;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function MetalSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
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
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8888ff" />
        <MetalSphere />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
