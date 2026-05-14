import type { Chat } from './types';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface Props {
  chats: Chat[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
}

export default function Sidebar({ chats, currentId, onNewChat, onLoadChat }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setIsDark(saved);
    if (saved) document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };
  return (
    <div className="fixed left-0 top-0 w-[240px] h-screen bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-3.5 flex flex-col gap-1 overflow-y-auto z-10 transition-colors duration-300">
      <button
        onClick={onNewChat}
        title="Iniciar una nueva conversación"
        className="bg-purple-600 hover:bg-purple-500 italic flex items-center justify-center gap-2 py-4 px-6 rounded-full transition shadow-lg shadow-purple-500/20 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        Nuevo chat
      </button>
      
      <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-[0.1em] px-2 py-1 mt-6">Historial</span>
      
      <div className="flex-1 flex flex-col gap-1 mt-2">
        {chats.length === 0 ? (
          <p className="text-[12px] text-gray-400 dark:text-zinc-600 px-3 py-2 italic">Sin chats aún</p>
        ) : (
          chats.map(c => (
            <button
              key={c.id}
              onClick={() => onLoadChat(c.id)}
              className={`block w-full py-3 px-3.5 rounded-xl cursor-pointer text-sm whitespace-nowrap overflow-hidden text-ellipsis text-left border-none transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                c.id === currentId 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                  : 'text-gray-600 dark:text-zinc-400'
              }`}
            >
              {c.title}
            </button>
          ))
        )}
      </div>

      <div className="pt-4 mt-auto border-t border-gray-200 dark:border-zinc-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm text-gray-600 dark:text-zinc-400"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
    </div>
  );
}
