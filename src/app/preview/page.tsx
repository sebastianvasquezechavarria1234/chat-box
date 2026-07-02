'use client';

import { motion } from 'framer-motion';
import AIOrb from '@/components/AIOrb';

export default function Preview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <AIOrb size="lg" />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white"
        >
          Zenith GPT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="mt-4 text-lg text-zinc-400"
        >
          Inteligencia Artificial Avanzada
        </motion.p>
      </motion.div>
    </div>
  );
}
