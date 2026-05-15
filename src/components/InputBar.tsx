'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, MessageSquare, GraduationCap, Briefcase, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSend: (question: string, personality: string) => void;
  disabled: boolean;
}

const personalities = [
  { id: 'casual',      label: 'Casual',       icon: MessageSquare,  gradient: 'from-blue-400 to-blue-600' },
  { id: 'tutor',       label: 'Tutor',         icon: GraduationCap, gradient: 'from-emerald-400 to-emerald-600' },
  { id: 'profesional', label: 'Profesional',   icon: Briefcase,     gradient: 'from-violet-400 to-violet-600' },
  { id: 'tecnico',     label: 'Técnico',       icon: Settings,      gradient: 'from-orange-400 to-orange-600' },
];

export default function InputBar({ onSend, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [personality, setPersonality] = useState('casual');
  const [showPersonalities, setShowPersonalities] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  useEffect(() => {
    if (showPersonalities) {
      const handle = () => setShowPersonalities(false);
      window.addEventListener('click', handle);
      return () => window.removeEventListener('click', handle);
    }
  }, [showPersonalities]);

  const handleSend = () => {
    const q = question.trim();
    if (!q || disabled) return;
    onSend(q, personality);
    setQuestion('');
  };

  const currentP = personalities.find(p => p.id === personality) || personalities[0];
  const CurrentIcon = currentP.icon;

  return (
    <div className="fixed bottom-20 lg:bottom-8 left-4 lg:left-[340px] right-4 lg:right-8 flex flex-col items-center">
      <div className="w-full max-w-[900px] bg-white dark:bg-zinc-900 rounded-2xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 focus-within:ring-2 focus-within:ring-indigo-400/50 dark:focus-within:ring-indigo-500/50 transition-all duration-300">
        
        <div className="flex items-end gap-2 px-4 pt-4 pb-3">
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
            placeholder="Escribe tu mensaje..."
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />

          <motion.button
            onClick={handleSend}
            disabled={disabled || !question.trim()}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-300 dark:disabled:text-zinc-600 transition-all shadow-sm shrink-0"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </motion.button>
        </div>

        <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none">
          {personalities.map(p => {
            const PIcon = p.icon;
            const isActive = personality === p.id;
            return (
              <button
                key={p.id}
                onClick={(e) => { e.stopPropagation(); setPersonality(p.id); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${p.gradient} text-white shadow-sm`
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <PIcon size={13} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
