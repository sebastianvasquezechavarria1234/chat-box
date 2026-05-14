'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, ChevronDown } from 'lucide-react';

interface Props {
  onSend: (question: string, personality: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [personality, setPersonality] = useState('casual');
  const [showPersonalities, setShowPersonalities] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    const q = question.trim();
    if (!q || disabled) return;
    onSend(q, personality);
    setQuestion('');
  };

  const personalities = ['casual', 'tutor', 'profesional', 'tecnico'];

  return (
    <div className="fixed bottom-8 left-[340px] right-8 flex flex-col items-center">
      <div className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-3 flex flex-col gap-2 transition-all hover:border-zinc-200 dark:hover:border-zinc-700">
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
          className="w-full bg-transparent border-none outline-none resize-none px-4 py-2 text-[16px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-medium"
        />
        
        <div className="flex items-center justify-between mt-1 px-2 pb-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowPersonalities(!showPersonalities)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-xs font-medium text-zinc-500 dark:text-zinc-400"
              >
                Personalidad <ChevronDown size={14} />
              </button>
              {showPersonalities && (
                <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-xl p-1 z-50 min-w-[140px]">
                  {personalities.map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setPersonality(p);
                        setShowPersonalities(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-600 dark:text-zinc-300"
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-2 text-xs font-bold">
              <Paperclip size={18} /> Adjuntar
            </button>
            <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-2 text-xs font-bold">
              <Mic size={18} /> Voz
            </button>
            <button
              onClick={handleSend}
              disabled={disabled || !question.trim()}
              className="bg-[#0F172A] hover:bg-zinc-800 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-full px-6 py-2.5 flex items-center gap-2 text-xs font-medium transition-all shadow-md active:scale-95"
            >
              <Send size={16} /> Enviar
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-zinc-400 font-medium">
        Orbita puede mostrar información imprecisa, por favor verifica la respuesta. <span className="underline cursor-pointer">Tu privacidad y Orbita</span>
      </p>
    </div>
  );
}
