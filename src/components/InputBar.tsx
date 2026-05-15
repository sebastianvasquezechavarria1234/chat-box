'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, MessageSquare, GraduationCap, Briefcase, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSend: (question: string, personality: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [personality, setPersonality] = useState('casual');
  const [showPersonalities, setShowPersonalities] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autoenfoque al cargar y después de que la IA responda
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
    // El foco regresará automáticamente gracias al useEffect cuando disabled sea false
  };

  const personalities = [
    { id: 'casual',      label: 'Casual',       icon: MessageSquare },
    { id: 'tutor',       label: 'Tutor',         icon: GraduationCap },
    { id: 'profesional', label: 'Profesional',   icon: Briefcase },
    { id: 'tecnico',     label: 'Técnico',       icon: Settings },
  ];

  const currentP = personalities.find(p => p.id === personality) || personalities[0];
  const CurrentIcon = currentP.icon;

  return (
    <div className="fixed bottom-6 left-[340px] right-8 flex flex-col items-center">
      <div className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-3 flex flex-col gap-2 transition-all hover:border-zinc-200 dark:hover:border-zinc-700 focus-within:border-indigo-200 dark:focus-within:border-indigo-900/50">
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
          className="w-full bg-transparent border-none outline-none resize-none px-4 py-2 text-[16px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-light"
        />
        
        <div className="flex items-center justify-between mt-1 px-2 pb-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowPersonalities(!showPersonalities)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                <CurrentIcon size={14} />
                <span>{currentP.label}</span>
                <ChevronDown size={12} className={`opacity-40 transition-transform ${showPersonalities ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showPersonalities && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute bottom-full mb-2 left-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 py-1.5 min-w-[160px] overflow-hidden"
                  >
                    {personalities.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersonality(p.id);
                          setShowPersonalities(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <p.icon size={14} className={personality === p.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'} />
                        <span className={`text-xs ${personality === p.id ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-300'}`}>
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              disabled={disabled || !question.trim()}
              className="bg-zinc-950 dark:bg-white dark:text-zinc-950 hover:opacity-90 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-full px-6 py-2.5 flex items-center gap-2 text-xs font-medium transition-all shadow-md active:scale-95"
            >
              <Send size={16} /> Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
