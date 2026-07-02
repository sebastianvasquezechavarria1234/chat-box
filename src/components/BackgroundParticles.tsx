'use client';

import { useMemo } from 'react';

export default function BackgroundParticles({ count = 100 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r="1"
            fill="white"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${p.duration}s`}
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
