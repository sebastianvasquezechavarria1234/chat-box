'use client';

import type { Message } from './types';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  messages: Message[];
}

export default function ChatMessages({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-6 p-4 flex-1 pb-[180px]">
      {messages.map((msg, i) =>
        msg.t === 'u' ? (
          <div
            key={i}
            className="self-end bg-black/5 dark:bg-white/10 px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-[15px] shadow-sm"
          >
            {msg.x}
          </div>
        ) : (
          <div
            key={i}
            className="self-start flex gap-4 max-w-[90%]"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
              IA
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-[15px] text-gray-800 dark:text-gray-200">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-purple-600 dark:text-purple-400" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {msg.x}
              </ReactMarkdown>
            </div>
          </div>
        )
      )}
      <div ref={endRef} />
    </div>
  );
}
