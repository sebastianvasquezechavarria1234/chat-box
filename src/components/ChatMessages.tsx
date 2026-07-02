'use client';

import type { Message } from './types';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import AIOrb from './AIOrb';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-8 px-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-violet-500"
          animate={{ y: [0, -6, 0], scaleY: [1, 1.4, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  messages: Message[];
  chatId?: string | null;
  sending?: boolean;
}

export default function ChatMessages({ messages, chatId, sending }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const prevLenRef = useRef(0);
  const prevChatIdRef = useRef<string | null | undefined>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isFirstRender.current) {
    isFirstRender.current = false;
    prevLenRef.current = messages.length;
    prevChatIdRef.current = chatId;
  }

  const chatSwitched = prevChatIdRef.current !== chatId;
  prevChatIdRef.current = chatId;

  if (chatSwitched) {
    prevLenRef.current = messages.length;
  }

  const prevLen = prevLenRef.current;
  prevLenRef.current = messages.length;

  return (
    <div className="flex flex-col gap-6 p-4 flex-1 pb-[180px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={chatId || 'empty'}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
        {messages.map((msg, i) => {
          const isNew = i >= prevLen;
          return msg.t === 'u' ? (
            <motion.div
              key={`user-${i}`}
              initial={isNew ? { opacity: 0, y: 24, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="self-end group relative"
            >
              <div className="bg-black/5 dark:bg-white/10 px-4 lg:px-5 py-3 rounded-2xl rounded-tr-none max-w-full text-[15px] text-zinc-900 dark:text-white shadow-sm transition-colors duration-300">
                {msg.x}
              </div>
              <button 
                onClick={() => copyToClipboard(msg.x, `user-${i}`)}
                className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {copiedId === `user-${i}` ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`bot-${i}`}
              initial={isNew ? { opacity: 0, y: 24, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: isNew ? 0.08 : 0 }}
              className="self-start flex gap-3 lg:gap-4 max-w-full lg:max-w-[90%]"
            >
              <div className="flex-shrink-0 mt-1">
                <AIOrb size="sm" />
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-[15px] text-gray-800 dark:text-gray-200 transition-colors duration-300">
                <AnimatePresence mode="wait">
                  {msg.x === '' && sending ? (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(8px)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      const codeId = `code-${i}-${match ? match[1] : 'text'}`;
                      
                      return !inline && match ? (
                        <div className="relative group/code my-4">
                          <button
                            onClick={() => copyToClipboard(codeString, codeId)}
                            className="absolute right-2 top-2 p-1.5 rounded-lg bg-zinc-800/50 text-zinc-400 opacity-0 group-hover/code:opacity-100 transition-opacity hover:bg-zinc-800 hover:text-white z-10"
                          >
                            {copiedId === codeId ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg shadow-lg !m-0"
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
        </motion.div>
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}
