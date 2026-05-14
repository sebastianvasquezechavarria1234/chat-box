'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, Chat } from '@/components/types';
import Sidebar from '@/components/Sidebar';
import WelcomeModal from '@/components/WelcomeModal';
import ChatMessages from '@/components/ChatMessages';
import Suggestions from '@/components/Suggestions';
import InputBar from '@/components/InputBar';
import InfoModal from '@/components/InfoModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://python-api-render-ubr9.onrender.com/ask';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentMsgs, setCurrentMsgs] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(savedChats);
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
      setShowWelcome(false);
    }
  }, []);

  const saveChats = useCallback((newChats: Chat[]) => {
    setChats(newChats);
    localStorage.setItem('chats', JSON.stringify(newChats));
  }, []);

  const startChat = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowWelcome(false);
    setCurrentId(Date.now().toString());
  };

  const newChat = () => {
    setCurrentId(Date.now().toString());
    setCurrentMsgs([]);
  };

  const loadChat = (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    setCurrentId(id);
    setCurrentMsgs(chat.msgs);
    setUserName(chat.userName);
  };

  const saveCurrentChat = useCallback(() => {
    if (!currentId || currentMsgs.length === 0) return;
    const title = currentMsgs.find(m => m.t === 'u')?.x.slice(0, 35) || 'Chat';
    const i = chats.findIndex(c => c.id === currentId);
    const entry: Chat = { id: currentId, title, msgs: currentMsgs, userName };
    const newChats = i >= 0
      ? chats.map((c, idx) => idx === i ? entry : c)
      : [entry, ...chats];
    saveChats(newChats);
  }, [currentId, currentMsgs, chats, userName, saveChats]);

  useEffect(() => {
    if (currentMsgs.length > 0 && !sending) {
      const timer = setTimeout(() => saveCurrentChat(), 300);
      return () => clearTimeout(timer);
    }
  }, [currentMsgs, sending, saveCurrentChat]);

  const sendMessage = async (question: string, personality: string) => {
    const id = currentId || Date.now().toString();
    if (!currentId) setCurrentId(id);

    setCurrentMsgs(prev => [...prev, { t: 'u', x: question }, { t: 'b', x: 'Pensando...' }]);
    setSending(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, question, personality }),
      });
      const data = await res.json();

      setCurrentMsgs(prev => {
        const withoutLoading = prev.slice(0, -1);
        return [...withoutLoading, { t: 'b', x: '' }];
      });

      const answer = data.answer;
      for (let i = 0; i < answer.length; i++) {
        await new Promise(r => setTimeout(r, 7));
        setCurrentMsgs(prev => {
          const next = [...prev];
          next[next.length - 1] = { t: 'b', x: answer.slice(0, i + 1) };
          return next;
        });
      }
    } catch {
      setCurrentMsgs(prev => {
        const withoutLoading = prev.slice(0, -1);
        return [...withoutLoading, { t: 'b', x: 'Error al conectar con la API ❌' }];
      });
    }

    setSending(false);
  };

  const handleSuggestion = (text: string) => {
    const question = text.replace(/^[^\s]+\s/, '').trim();
    sendMessage(question, 'casual');
  };

  return (
    <>
      <Sidebar chats={chats} currentId={currentId} onNewChat={newChat} onLoadChat={loadChat} />

      {showWelcome && <WelcomeModal onStart={startChat} />}

      <div className="pl-[250px] pr-2.5 min-h-screen">
        <div className="ml-[240px] max-w-[900px] min-h-screen flex flex-col mx-auto transition-all duration-300">
        <div className="py-3 px-6 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <span className="text-sm font-medium italic text-gray-500 dark:text-zinc-500">
            Chateando como: <strong className="text-gray-800 dark:text-zinc-200 not-italic ml-1">{userName || '...'}</strong>
          </span>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowInfo(true)}
              className="bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 text-xs font-bold py-2.5 px-5 rounded-full transition-all border border-purple-200 dark:border-purple-800/30"
            >
              Documentación
            </button>
            <a
              href="https://sebas-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-bold py-2.5 px-5 rounded-full transition-all flex items-center gap-2"
            >
              Portafolio
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 220 }}>
          <ChatMessages messages={currentMsgs} chatId={currentId} />
        </div>

        {currentMsgs.length === 0 && <Suggestions onSuggestion={handleSuggestion} />}

        <InputBar onSend={sendMessage} disabled={sending} />
        </div>
      </div>

      <InfoModal show={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}
