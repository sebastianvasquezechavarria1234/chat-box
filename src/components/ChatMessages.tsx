'use client';

import type { Message } from './types';
import { useRef, useEffect } from 'react';

interface Props {
  messages: Message[];
}

export default function ChatMessages({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 p-4 flex-1 pb-[180px]">
      {messages.map((msg, i) =>
        msg.t === 'u' ? (
          <div
            key={i}
            style={{ alignSelf: 'flex-end', background: '#00000016', padding: '14px 18px', borderRadius: '30px 0 30px 30px', maxWidth: 320, fontSize: 15 }}
          >
            {msg.x}
          </div>
        ) : (
          <div
            key={i}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 600 }}
          >
            <span style={{ minWidth: 10, height: 10, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: '#b439fbe8' }} />
            <span style={{ fontSize: 15, color: '#1f2937', lineHeight: 1.7 }}>
              {msg.x}
            </span>
          </div>
        )
      )}
      <div ref={endRef} />
    </div>
  );
}
