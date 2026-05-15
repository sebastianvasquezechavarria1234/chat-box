'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Type, Calendar, Zap, TrendingUp, Clock } from 'lucide-react';

export interface UserStats {
  totalMessages: number;
  totalCharsSent: number;
  totalCharsReceived: number;
  totalChatsCreated: number;
  firstUse: string;
  lastActive: string;
  activeDays: number;
}

interface Props {
  stats: UserStats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: Props) {
  const now = new Date();
  const lastActive = new Date(stats.lastActive);
  const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  const items = [
    {
      icon: <MessageSquare size={18} />,
      label: 'Mensajes totales',
      value: stats.totalMessages.toLocaleString(),
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: <Type size={18} />,
      label: 'Caracteres enviados',
      value: stats.totalCharsSent.toLocaleString(),
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      icon: <Type size={18} className="rotate-180" />,
      label: 'Caracteres recibidos',
      value: stats.totalCharsReceived.toLocaleString(),
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Chats creados',
      value: stats.totalChatsCreated.toLocaleString(),
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: <Calendar size={18} />,
      label: 'Días activo',
      value: `${stats.activeDays}`,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Primer uso',
      value: new Date(stats.firstUse).toLocaleDateString('es', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 30 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.9 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl dark:border dark:border-zinc-800 overflow-hidden"
        style={{ width: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Zap size={18} className="text-white dark:text-zinc-900 fill-white dark:fill-zinc-900" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Estadísticas</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Tu actividad en Zenith GPT</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3, ease: 'easeOut' }}
                className={`${item.bg} rounded-2xl p-4 flex flex-col gap-2`}
              >
                <div className={`${item.color}`}>{item.icon}</div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</span>
                <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{item.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3, ease: 'easeOut' }}
            className="mt-4 flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl"
          >
            <Clock size={16} className="text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {diffDays === 0
                ? 'Estuviste activo hoy'
                : diffDays === 1
                  ? 'Tu última actividad fue ayer'
                  : `Tu última actividad fue hace ${diffDays} días`}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
