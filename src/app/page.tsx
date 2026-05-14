'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Share2, Plus, Zap } from 'lucide-react';
import { MiniSidebar, ChatSidebar } from '@/components/NewSidebars';
import ChatMessages from '@/components/ChatMessages';
import InputBar from '@/components/InputBar';
import Suggestions from '@/components/Suggestions';
import WelcomeModal from '@/components/WelcomeModal';
import InfoModal from '@/components/InfoModal';
import type { Chat, Message } from '@/components/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://python-api-render-ubr9.onrender.com/ask';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_chats');
    const name = localStorage.getItem('nexus_user');
    if (saved) setChats(JSON.parse(saved));
    if (name) {
      setUserName(name);
      setShowWelcome(false);
    }
  }, []);

  const save = (newChats: Chat[]) => {
    setChats(newChats);
    localStorage.setItem('nexus_chats', JSON.stringify(newChats));
  };

  const startChat = (name: string) => {
    setUserName(name);
    localStorage.setItem('nexus_user', name);
    setShowWelcome(false);
  };

  const newChat = () => {
    const id = uuidv4();
    const nc: Chat = { id, title: 'Nueva conversación', msgs: [], userName };
    save([nc, ...chats]);
    setCurrentId(id);
  };

  const loadChat = (id: string) => setCurrentId(id);

  const currentChat = chats.find(c => c.id === currentId);
  const currentMsgs = currentChat ? currentChat.msgs : [];

  const handleSuggestion = (text: string) => {
    if (!currentId) {
      const id = uuidv4();
      const nc: Chat = { id, title: text.slice(0, 30), msgs: [], userName };
      const updated = [nc, ...chats];
      save(updated);
      setCurrentId(id);
      setTimeout(() => sendMessage(text, 'casual', id, updated), 100);
    } else {
      sendMessage(text, 'casual');
    }
  };

  const sendMessage = async (question: string, personality: string, chatId?: string, chatList?: Chat[]) => {
    let activeId = chatId || currentId;
    let activeList = chatList || chats;
    
    // Si no hay chat activo, crear uno automáticamente
    if (!activeId) {
      const id = uuidv4();
      const nc: Chat = { id, title: question.slice(0, 30), msgs: [], userName };
      activeList = [nc, ...chats];
      activeId = id;
      setCurrentId(id);
      save(activeList);
    }
    
    setSending(true);

    const userMsg: Message = { t: 'u', x: question };
    const updated = activeList.map(c => 
      c.id === activeId 
        ? { ...c, msgs: [...c.msgs, userMsg], title: c.msgs.length === 0 ? question.slice(0, 30) : c.title } 
        : c
    );
    save(updated);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, question, personality }),
      });
      const data = await res.json();
      
      const botMsg: Message = { t: 'b', x: data.answer || 'Error en respuesta' };
      // Usar el estado más reciente de chats para evitar problemas de concurrencia
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, msgs: [...c.msgs, botMsg] } : c));
      
      // Persistir el cambio (obteniendo el estado actualizado después del mapeo)
      setTimeout(() => {
        const finalSaved = JSON.parse(localStorage.getItem('nexus_chats') || '[]');
        const withBot = finalSaved.map((c: any) => c.id === activeId ? { ...c, msgs: [...c.msgs, botMsg] } : c);
        localStorage.setItem('nexus_chats', JSON.stringify(withBot));
      }, 100);

    } catch (err) {
      const errorMsg: Message = { t: 'b', x: 'No se pudo conectar con la IA. Verifica tu conexión.' };
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, msgs: [...c.msgs, errorMsg] } : c));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans tracking-tight">
      <MiniSidebar />
      <ChatSidebar 
        chats={chats} 
        currentId={currentId} 
        onNewChat={newChat} 
        onLoadChat={loadChat} 
      />

      {showWelcome && <WelcomeModal onStart={startChat} />}

      <main className="flex-1 ml-[320px] flex flex-col relative h-screen overflow-hidden">
        {/* Encabezado */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-50 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">Orbita</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Plus</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
            >
              <Settings size={14} /> Configuración
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
              <Share2 size={14} /> Compartir
            </button>
            <button 
              onClick={newChat}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-full text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
            >
              Nuevo Chat <Zap size={12} className="fill-white" />
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
          <AnimatePresence mode="wait">
            {currentMsgs.length === 0 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex-1"
              >
                <Suggestions onSuggestion={handleSuggestion} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, filter: 'blur(6px)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="max-w-[900px] mx-auto w-full py-8"
              >
                <ChatMessages messages={currentMsgs} chatId={currentId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <InputBar onSend={sendMessage} disabled={sending} />
      </main>

      <InfoModal show={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}
