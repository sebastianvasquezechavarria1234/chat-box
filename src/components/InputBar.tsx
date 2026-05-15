'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, GraduationCap, Briefcase, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSend: (question: string, personality: string) => void;
  disabled: boolean;
}

const personalities = [
  { id: 'casual',      label: 'Casual',       icon: MessageSquare },
  { id: 'tutor',       label: 'Tutor',         icon: GraduationCap },
  { id: 'profesional', label: 'Profesional',   icon: Briefcase },
  { id: 'tecnico',     label: 'Técnico',       icon: Settings },
];

export default function InputBar({ onSend, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [personality, setPersonality] = useState('casual');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const q = question.trim();
    if (!q || disabled) return;
    onSend(q, personality);
    setQuestion('');
  };

  const currentP = personalities.find(p => p.id === personality) || personalities[0];
  const CurrentIcon = currentP.icon;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 lg:left-[340px] right-4 lg:right-8 flex flex-col items-center">
      <div className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl shadow-zinc-200/50 dark:shadow-black/20 border border-gray-100 dark:border-zinc-800 p-3 flex flex-col gap-2 transition-all hover:border-zinc-200 dark:hover:border-zinc-700 focus-within:border-indigo-200 dark:focus-within:border-indigo-900/50">
        <div className="flex items-end gap-3 px-2 pt-1">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pregúntame cualquier cosa..."
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none resize-none px-2 py-3 text-[16px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-light leading-relaxed"
          />

          <motion.button
            onClick={handleSend}
            disabled={disabled || !question.trim()}
            whileTap={{ scale: 0.9 }}
            className="mb-1 p-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-300 dark:disabled:text-zinc-600 transition-all shadow-md shrink-0"
          >
            <Send size={16} />
          </motion.button>
        </div>

        <div className="flex items-center gap-1.5 px-2 pb-1 overflow-x-auto scrollbar-none">
          {personalities.map(p => {
            const PIcon = p.icon;
            const isActive = personality === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersonality(p.id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0"
              >
                {isActive && (
                  <motion.div
                    layoutId="personality-bg"
                    className="absolute inset-0 rounded-lg bg-zinc-900 dark:bg-white shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  <PIcon size={13} />
                </span>
                <span className={`relative z-10 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
