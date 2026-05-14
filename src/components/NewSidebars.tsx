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

import type { Chat } from './types';

interface SidebarProps {
  chats: Chat[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
}

export function ChatSidebar({ chats, currentId, onNewChat, onLoadChat }: SidebarProps) {
  return (
    <div className="fixed left-[60px] top-0 w-[260px] h-screen bg-[#F9FAFB] dark:bg-zinc-900/50 border-r border-gray-100 dark:border-zinc-900 p-4 flex flex-col z-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Chat</h2>
        <Search size={16} className="text-zinc-400 cursor-pointer" />
      </div>

      <button
        onClick={onNewChat}
        className="w-full bg-[#0F172A] hover:bg-zinc-800 text-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm mb-6"
      >
        <Plus size={16} />
        New Chat
        <Zap size={14} className="fill-white" />
      </button>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Star size={10} /> Saved
          </span>
        </div>
        
        <div className="flex flex-col gap-1 mb-6">
           {/* Mock saved chats */}
           <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all text-sm text-zinc-600 dark:text-zinc-400">
             <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600 font-bold">C</div>
             <span className="flex-1 text-left truncate">ChatAI</span>
             <MoreHorizontal size={14} className="text-zinc-300" />
           </button>
           <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all text-sm text-zinc-600 dark:text-zinc-400">
             <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-[10px] text-orange-600 font-bold">I</div>
             <span className="flex-1 text-left truncate">Image of sun</span>
             <MoreHorizontal size={14} className="text-zinc-300" />
           </button>
        </div>

        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Today</span>
        </div>
        
        {chats.map(c => (
          <button
            key={c.id}
            onClick={() => onLoadChat(c.id)}
            className={`block w-full py-2.5 px-3 rounded-xl text-sm text-left transition-all truncate ${
              c.id === currentId 
                ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white font-medium' 
                : 'text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <p className="text-xs text-zinc-500 mb-3">Get smarter with Orbita Pro</p>
          <button className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
