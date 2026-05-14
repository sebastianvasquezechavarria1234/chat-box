'use client';

import { 
  MessageSquare, 
  Clock, 
  Zap, 
  LayoutGrid, 
  Archive, 
  Settings, 
  User, 
  Plus,
  Search,
  MoreHorizontal,
  Layout,
  Star
} from 'lucide-react';

export function MiniSidebar() {
  return (
    <div className="fixed left-0 top-0 w-[60px] h-screen bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 flex flex-col items-center py-6 z-30">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-8" />
      
      <div className="flex flex-col gap-6 flex-1">
        <button className="text-zinc-900 dark:text-white p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"><MessageSquare size={20} /></button>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Clock size={20} /></button>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Zap size={20} /></button>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><LayoutGrid size={20} /></button>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Archive size={20} /></button>
      </div>

      <div className="flex flex-col gap-6">
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Settings size={20} /></button>
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
          S
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Chat } from './types';

interface SidebarProps {
  chats: Chat[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
}

export function ChatSidebar({ chats, currentId, onNewChat, onLoadChat }: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery
    ? chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  return (
    <div className="fixed left-[60px] top-0 w-[260px] h-screen bg-[#F9FAFB] dark:bg-zinc-900/50 border-r border-gray-100 dark:border-zinc-900 p-4 flex flex-col z-20">
      <div className="flex items-center justify-between mb-6 px-2">
        {searchOpen ? (
          <div className="flex items-center gap-2 w-full">
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              placeholder="Buscar charlas..."
              className="w-full bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
            <Search size={16} className="text-zinc-400 cursor-pointer" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Charlas</h2>
            <Search size={16} className="text-zinc-400 cursor-pointer" onClick={() => setSearchOpen(true)} />
          </>
        )}
      </div>

      <button
        onClick={onNewChat}
        className="w-full bg-[#0F172A] hover:bg-zinc-800 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm mb-6"
      >
        <Plus size={16} />
        Nuevo chat
        <Zap size={14} className="fill-white" />
      </button>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Star size={10} /> Guardados
          </span>
        </div>
        
        <div className="flex flex-col gap-1 mb-6">
           {/* Chats guardados de ejemplo */}
           <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all text-sm text-zinc-600 dark:text-zinc-400">
             <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600 font-bold">C</div>
             <span className="flex-1 text-left truncate">Chat IA</span>
             <MoreHorizontal size={14} className="text-zinc-300" />
           </button>
           <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all text-sm text-zinc-600 dark:text-zinc-400">
             <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-[10px] text-orange-600 font-bold">I</div>
             <span className="flex-1 text-left truncate">Imagen del sol</span>
             <MoreHorizontal size={14} className="text-zinc-300" />
           </button>
        </div>

        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hoy</span>
        </div>
        
        {filtered.map(c => {
          const initial = c.title.charAt(0).toUpperCase();
          const colors = [
            'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
            'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
            'bg-green-100 dark:bg-green-900/30 text-green-600',
            'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
            'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
            'bg-teal-100 dark:bg-teal-900/30 text-teal-600',
            'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
            'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
          ];
          const colorIdx = c.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colors.length;
          return (
            <button
              key={c.id}
              onClick={() => onLoadChat(c.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                c.id === currentId 
                  ? 'bg-white dark:bg-zinc-800 shadow-sm' 
                  : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${colors[colorIdx]}`}>{initial}</div>
              <span className={`flex-1 truncate ${
                c.id === currentId ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500'
              }`}>{c.title}</span>
              <MoreHorizontal size={14} className="text-zinc-300" />
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <p className="text-xs text-zinc-500 mb-3">Mejora con Orbita Pro</p>
          <button className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
            Actualizar a Pro
          </button>
        </div>
      </div>
    </div>
  );
}
