'use client';

import { 
  MessageSquare, 
  Clock, 
  Zap,
  Sparkles, 
  LayoutGrid, 
  Archive, 
  Settings, 
  Plus,
  Search,
  MoreHorizontal,
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

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chat } from './types';

interface SidebarProps {
  chats: Chat[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
}

function ChatMenu({ chat, onClose, onToggleFavorite, onDeleteChat, onRenameChat }: {
  chat: Chat;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDeleteChat: () => void;
  onRenameChat: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-xl z-50 py-1 min-w-[160px]" onClick={e => e.stopPropagation()}>
      <button onClick={() => { onToggleFavorite(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
        <Star size={14} /> {chat.favorite ? 'Quitar de favoritos' : 'Favorito'}
      </button>
      <button onClick={() => { onRenameChat(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        Editar nombre
      </button>
      <button onClick={() => { onDeleteChat(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Eliminar
      </button>
    </div>
  );
}

export function ChatSidebar({ chats, currentId, onNewChat, onLoadChat, onToggleFavorite, onDeleteChat, onRenameChat }: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = searchQuery
    ? chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const favorites = filtered.filter(c => c.favorite);
  const regular = filtered.filter(c => !c.favorite);

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

  const colorFor = (id: string) => colors[id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colors.length];

  function renderChat(c: Chat) {
    const initial = c.title.charAt(0).toUpperCase();
    const isMenuOpen = menuChatId === c.id;
    return (
      <motion.div
        key={c.id}
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative group"
      >
        <button
          onClick={() => { onLoadChat(c.id); setMenuChatId(null); }}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
            c.id === currentId 
              ? 'bg-white dark:bg-zinc-800 shadow-sm' 
              : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${colorFor(c.id)}`}>{initial}</div>
          {editingId === c.id ? (
            <input
              autoFocus
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={() => { onRenameChat(c.id, editValue); setEditingId(null); }}
              onKeyDown={e => {
                if (e.key === 'Enter') { onRenameChat(c.id, editValue); setEditingId(null); }
                if (e.key === 'Escape') setEditingId(null);
              }}
              onClick={e => e.stopPropagation()}
              className="flex-1 bg-transparent border-b border-zinc-300 dark:border-zinc-600 outline-none text-sm text-zinc-900 dark:text-white"
            />
          ) : (
            <span className={`flex-1 truncate ${c.id === currentId ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500'}`}>{c.title}</span>
          )}
          <MoreHorizontal
            size={14}
            className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => { e.stopPropagation(); setMenuChatId(isMenuOpen ? null : c.id); }}
          />
        </button>
        {isMenuOpen && (
          <ChatMenu
            chat={c}
            onClose={() => setMenuChatId(null)}
            onToggleFavorite={() => onToggleFavorite(c.id)}
            onDeleteChat={() => onDeleteChat(c.id)}
            onRenameChat={() => { setEditingId(c.id); setEditValue(c.title); }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <div className="fixed left-[60px] top-0 w-[260px] h-screen bg-[#F9FAFB] dark:bg-zinc-900/50 border-r border-gray-100 dark:border-zinc-900 p-4 flex flex-col z-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 w-full overflow-hidden"
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                placeholder="Buscar charlas..."
                className="w-full bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              <Search size={16} className="text-zinc-400 cursor-pointer shrink-0" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Charlas</h2>
              <Search size={16} className="text-zinc-400 cursor-pointer shrink-0" onClick={() => setSearchOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onNewChat}
        className="w-full bg-[#0F172A] hover:bg-zinc-800 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-normal transition-all shadow-sm mb-6"
      >
        Nuevo chat
        <Sparkles size={14} className="fill-white" strokeWidth={1.5} />
      </button>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden pr-1">
        {favorites.length > 0 && (
          <>
            <div className="px-2 mb-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] font-medium text-zinc-400 uppercase flex items-center gap-1">
                <Star size={10} /> Guardados
              </span>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <AnimatePresence mode="popLayout">
                {favorites.map(renderChat)}
              </AnimatePresence>
            </div>
          </>
        )}

        <div className="px-2 mb-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <span className="text-[10px] font-medium text-zinc-400 uppercase flex items-center gap-1">
            <Clock size={10} /> Hoy
          </span>
        </div>
        
        {regular.length === 0 && favorites.length === 0 ? (
          <p className="text-xs text-zinc-400 px-3 py-4 text-center">No hay chats aún</p>
        ) : regular.length === 0 ? null : (
          <AnimatePresence mode="popLayout">
            {regular.map(renderChat)}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-auto pt-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <p className="text-xs text-zinc-500 mb-3">Get smarter with Zenith GPT PRO</p>
          <button className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
