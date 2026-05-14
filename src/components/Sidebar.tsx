'use client';

import type { Chat } from './types';

interface Props {
  chats: Chat[];
  currentId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
}

export default function Sidebar({ chats, currentId, onNewChat, onLoadChat }: Props) {
  return (
    <div className="fixed left-0 top-0 w-[240px] h-screen bg-gray-50 border-r border-gray-200 p-3.5 flex flex-col gap-1 overflow-y-auto z-10">
      <button
        onClick={onNewChat}
        title="Iniciar una nueva conversación"
        className="bg-purple-600 hover:bg-purple-400 italic flex items-center gap-2 py-4 px-6 rounded-full transition border border-purple-300 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        Nuevo chat
      </button>
      <span className="text-xs text-gray-400 uppercase tracking-wider px-2 py-1 mt-2">Historial</span>
      {chats.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9ca3af', padding: 8 }}>Sin chats aún</p>
      ) : (
        chats.map(c => (
          <button
            key={c.id}
            onClick={() => onLoadChat(c.id)}
            className={`block w-full py-3 px-3.5 rounded-xl cursor-pointer text-sm whitespace-nowrap overflow-hidden text-ellipsis text-left border-none bg-transparent transition hover:bg-gray-100 ${
              c.id === currentId ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-600'
            }`}
          >
            {c.title}
          </button>
        ))
      )}
    </div>
  );
}
