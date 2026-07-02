'use client';

import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

export const audioReactValue = { current: 0 };

export async function playTTS(text: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Fallo en TTS");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const update = () => {
        if (!audio.paused) {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          audioReactValue.current = avg / 255.0; // Normalizado 0 a 1
          requestAnimationFrame(update);
        } else {
          audioReactValue.current = 0;
        }
      };
      
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);

      audio.play();
      audioCtx.resume();
      update();
    } catch (err) {
      console.error("Error reproduciendo TTS", err);
      resolve(); // resolvemos de todas formas para no trabar la app
    }
  });
}
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
  const shaderRef = useRef<any>();
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const hoverValue = useRef(0);
  const targetHover = useRef(0);
  const customTime = useRef(0);

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
      hoverValue.current += (targetHover.current - hoverValue.current) * 0.05;
      
      // Combinamos el Hover del ratón con la fuerza del Audio en tiempo real
      const audioStrength = audioReactValue.current;
      const combinedForce = hoverValue.current + (audioStrength * 2.5);

      customTime.current += 0.015 * (1.0 + combinedForce * 4.0); // Se acelera con el hover o la voz
      
      shaderRef.current.uniforms.uTime.value = customTime.current;
      shaderRef.current.uniforms.uVelocity.value = velocity.current + (audioStrength * 1.5); // Picos extra al hablar
      shaderRef.current.uniforms.uHover.value = combinedForce;
    }

    if (!isDragging.current) {
      targetRotation.current.y = mouse.current.x * 1.2;
      targetRotation.current.x = mouse.current.y * 1.2;

      const baseRotY = customTime.current * 0.3;
      const baseRotX = Math.sin(customTime.current * 0.2) * 0.2;

      meshRef.current.rotation.y += (targetRotation.current.y + baseRotY - meshRef.current.rotation.y) * 0.08;
      meshRef.current.rotation.x += (targetRotation.current.x + baseRotX - meshRef.current.rotation.x) * 0.08;
    } else {
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.15;
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.15;
    }
  });

  const onBeforeCompile = useCallback((shader: any) => {
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

      // La distorsión se vuelve mucho más agresiva (puntiaguda) al hacer hover
      float distortionStrength = 0.18 + uVelocity * 1.2 + (uHover * 0.6);
      transformed = position + objectNormal * (noise1 * 0.7 + noise2 * 0.3) * distortionStrength;
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
        onPointerEnter={() => { targetHover.current = 1; onHover(1); }}
        onPointerLeave={() => { targetHover.current = 0; onHover(0); isDragging.current = false; }}
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

function OrbitingParticles({ count = 120, radius = 2.2, mousePos }: { count?: number; radius?: number; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const palette = [
      new THREE.Color('#5973e6'), // Azul
      new THREE.Color('#8059d9'), // Morado
      new THREE.Color('#f2738c'), // Rosa
      new THREE.Color('#ffb366'), // Durazno
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.1;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    ref.current.rotation.z = Math.cos(t * 0.05) * 0.05;

    const posAttr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const bx = positions[i * 3];
      const by = positions[i * 3 + 1];
      const bz = positions[i * 3 + 2];

      const mx = (mousePos.current?.x ?? 0) * 0.3;
      const my = (mousePos.current?.y ?? 0) * 0.3;

      const dx = mx - bx;
      const dy = my - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 3) * 0.4;

      // Movimiento orgánico como si respiraran
      const breathe = Math.sin(t * 2.0 + i) * 0.03;

      posAttr[i * 3] = bx + dx * influence + breathe;
      posAttr[i * 3 + 1] = by + dy * influence + breathe;
      posAttr[i * 3 + 2] = bz + breathe;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <clipping_planes_fragment>',
            `
            #include <clipping_planes_fragment>
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            // Borde difuminado para que parezcan luz
            float alpha = smoothstep(0.5, 0.1, d);
            `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec4 diffuseColor = vec4( diffuse, opacity * alpha );'
          );
        }}
      />
    </points>
  );
}

function ParticleStorm({ active, mousePos }: { active: boolean; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const time = useRef(0);

  const [positions, velocities, colors] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#5973e6'),
      new THREE.Color('#8059d9'),
      new THREE.Color('#f2738c'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      
      const speed = 0.02 + Math.random() * 0.03;
      vel[i * 3] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, vel, col];
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const material = ref.current.material as THREE.PointsMaterial;

    if (active) {
      time.current += 0.015;
      
      for (let i = 0; i < 100; i++) {
        const x = pos[i * 3];
        const y = pos[i * 3 + 1];
        const z = pos[i * 3 + 2];

        // Vórtice: fuerza giratoria
        const forceX = -z * 0.05;
        const forceZ = x * 0.05;
        const forceY = Math.sin(time.current * 5.0 + i) * 0.02;

        pos[i * 3] += velocities[i * 3] + forceX;
        pos[i * 3 + 1] += velocities[i * 3 + 1] + forceY;
        pos[i * 3 + 2] += velocities[i * 3 + 2] + forceZ;
        
        // Fricción
        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      material.opacity = Math.min(1, material.opacity + 0.05);
    } else {
      time.current = 0;
      material.opacity = Math.max(0, material.opacity - 0.05);
      
      if (material.opacity <= 0) {
        for (let i = 0; i < 100; i++) {
          pos[i * 3] = (Math.random() - 0.5) * 0.5;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
          
          const speed = 0.02 + Math.random() * 0.03;
          velocities[i * 3] = (Math.random() - 0.5) * speed;
          velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={100} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={100} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <clipping_planes_fragment>',
            `
            #include <clipping_planes_fragment>
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, d);
            `
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec4 diffuseColor = vec4( diffuse, opacity * alpha );'
          );
        }}
      />
    </points>
  );
}

type OrbSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<OrbSize, string> = {
  sm: 'w-16 h-16',
  md: 'w-60 h-60 mb-6', // 240px x 240px (antes 192px, creció ~50px)
  lg: 'w-72 h-72',
};

const cameraDistances: Record<OrbSize, number> = {
  sm: 6.0,  // Cámara más alejada para los orbes pequeños (sidebar, chats)
  md: 4.2,  // Cámara un toque más alejada para el orbe principal
  lg: 4.2,
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
        camera={{ position: [0, 0, cameraDistances[size]], fov: 50 }}
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
