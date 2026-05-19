'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onStart: (name: string) => void;
}

export default function WelcomeModal({ onStart }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Mínimo 2 caracteres');
      return;
    }
    setError('');
    onStart(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(4px)' }}
        transition={{ type: 'spring', damping: 24, stiffness: 280, mass: 0.8 }}
        className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl dark:border dark:border-zinc-800 w-[520px] p-10 flex flex-col gap-6"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={16} className="fill-zinc-900 dark:fill-white text-zinc-900 dark:text-white" strokeWidth={1.5} />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">Zenith GPT</span>
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase">PRO</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight">Bienvenido</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed">
            La API está en Render y entra en reposo automáticamente — la primera consulta puede tardar <strong className="text-zinc-600 dark:text-zinc-400">30–60 segundos</strong> en reactivar el servidor. Las siguientes serán inmediatas.
          </p>
        </div>

        <div className="relative">
          <input
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="Tu nombre..."
            className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-full outline-none px-6 py-4 text-[16px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-light transition-all focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-200/50 dark:focus:ring-zinc-700/50 pr-14"
          />
          <motion.button
            onClick={handleStart}
            whileTap={{ scale: 0.9 }}
            className="absolute right-1.5 top-1.5 p-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all shadow-md"
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </motion.button>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 mt-2 ml-6"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
