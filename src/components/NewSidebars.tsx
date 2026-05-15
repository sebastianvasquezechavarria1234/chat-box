'use client';

import { 
  MessageSquare, 
  Clock,
  Sparkles, 
  Settings, 
  Search,
  MoreHorizontal,
  Star,
  Sun,
  Moon,
  X
} from 'lucide-react';
import AIOrb from './AIOrb';

 export function MiniSidebar({ isDark, onToggleTheme, onToggleStats }: { isDark: boolean, onToggleTheme: () => void, onToggleStats?: () => void }) {
  return (
    <>
      {/* Desktop: vertical left sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 w-[60px] h-screen bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 flex-col items-center py-6 z-30">
        <AIOrb size="sm" />
        
        <div className="flex flex-col items-center gap-6 flex-1 mt-8">
          <button className="text-zinc-900 dark:text-white p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 transition-colors"><MessageSquare size={20} /></button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={onToggleTheme}
            className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
<button onClick={onToggleStats} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Settings size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
            S
          </div>
        </div>
      </div>

      {/* Mobile: bottom navigation bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 flex items-center justify-around px-4 z-30">
        <button className="text-zinc-900 dark:text-white p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 transition-colors"><MessageSquare size={20} /></button>
        <button 
          onClick={onToggleTheme}
          className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={onToggleStats} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Settings size={20} /></button>
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
          S
        </div>
      </div>
    </>
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
  mobileOpen?: boolean;
  onMobileClose?: () => void;
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
    <div ref={ref} className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-xl z-50 py-1 min-w-[160px]">
      <button type="button" onClick={(e) => { e.stopPropagation(); onToggleFavorite(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
        <Star size={14} /> {chat.favorite ? 'Quitar de favoritos' : 'Favorito'}
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onRenameChat(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
        Editar nombre
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteChat(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Eliminar
      </button>
    </div>
  );
}

export function ChatSidebar({ chats, currentId, onNewChat, onLoadChat, onToggleFavorite, onDeleteChat, onRenameChat, mobileOpen, onMobileClose }: SidebarProps) {
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
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all relative ${
            c.id !== currentId ? 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50' : ''
          }`}
        >
          {c.id === currentId && (
            <motion.div
              layoutId="chat-active"
              className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-medium relative z-10 ${colorFor(c.id)}`}>{initial}</div>
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
              className="flex-1 bg-transparent border-b border-zinc-300 dark:border-zinc-600 outline-none text-sm text-zinc-900 dark:text-white relative z-10"
            />
          ) : (
            <span className={`flex-1 truncate relative z-10 ${c.id === currentId ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>{c.title}</span>
          )}
          <MoreHorizontal
            size={14}
            className="text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
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

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-6 pl-2 pr-4">
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
              <Search size={16} className="text-zinc-400 dark:text-zinc-500 cursor-pointer shrink-0" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
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
              <div className="flex items-center gap-2">
                <Search size={16} className="text-zinc-400 dark:text-zinc-500 cursor-pointer shrink-0" onClick={() => setSearchOpen(true)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onNewChat}
        className="w-full bg-[#0F172A] dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl py-2 px-3 flex items-center justify-center gap-2 text-sm font-normal transition-all shadow-sm mb-6 mr-1"
      >
        Nuevo chat
        <Sparkles size={14} className="fill-white dark:fill-zinc-900" strokeWidth={1.5} />
      </button>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden pr-3">
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
    </>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={onMobileClose} />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed left-0 top-0 w-[280px] h-screen bg-[#F9FAFB] dark:bg-zinc-900/50 border-r border-gray-100 dark:border-zinc-900 p-4 flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end mb-2">
          <button onClick={onMobileClose} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-[60px] top-0 w-[260px] h-screen bg-[#F9FAFB] dark:bg-zinc-900/50 border-r border-gray-100 dark:border-zinc-900 pl-4 pr-2 py-4 flex flex-col z-20">
        {sidebarContent}
      </div>
    </>
  );
}
