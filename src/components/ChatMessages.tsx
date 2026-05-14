'use client';

import type { Message } from './types';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  messages: Message[];
  chatId?: string | null;
}

export default function ChatMessages({ messages, chatId }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-6 p-4 flex-1 pb-[180px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={chatId || 'empty'}
          initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -40, filter: 'blur(6px)' }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          {messages.map((msg, i) =>
            msg.t === 'u' ? (
              <motion.div
                key={`user-${i}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="self-end bg-black/5 dark:bg-white/10 px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] text-[15px] shadow-sm"
              >
                {msg.x}
              </motion.div>
            ) : (
              <motion.div
                key={`bot-${i}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="self-start flex gap-4 max-w-[90%]"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
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
                            className="rounded-lg my-4 shadow-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 font-medium" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.x}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )
          )}
        </motion.div>
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}
