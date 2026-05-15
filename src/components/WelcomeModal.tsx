'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onStart: (name: string) => void;
}

export default function WelcomeModal({ onStart }: Props) {
  const [name, setName] = useState('');

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      alert('Por favor, ingresa un nombre válido (mínimo 2 caracteres)');
      return;
    }
    onStart(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.119)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 50, filter: 'blur(4px)' }}
        transition={{ type: 'spring', damping: 24, stiffness: 280, mass: 0.8 }}
        style={{ borderRadius: 30 }}
        className="bg-white dark:bg-zinc-900 w-[520px] p-12 flex flex-col gap-4 shadow-2xl dark:border dark:border-zinc-800"
      >
        <h1 className="text-center italic text-3xl font-light text-gray-800 dark:text-zinc-200">¡Bienvenido!</h1>
        <p className="text-center text-gray-500 dark:text-zinc-400 text-sm">
          La API de este chat está desplegada en Render, el servidor entra en reposo automáticamente — la primera consulta lo reactiva, lo que puede tomar entre 30 y 60 segundos. Las siguientes respuestas serán inmediatas.
        </p>
        <div className="relative">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="Tu nombre..."
            className="w-full rounded-full border border-gray-200 dark:border-zinc-700 outline-none bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            style={{ padding: '20px 60px 20px 20px', fontSize: 18 }}
          />
          <button
            onClick={handleStart}
            className="absolute right-1.5 top-1.5 bg-purple-600 hover:bg-purple-400 flex justify-center items-center rounded-full transition"
            style={{ width: 55, height: 55 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
