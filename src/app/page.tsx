'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ExternalLink, ArrowDownToLine, Mic } from 'lucide-react';
import { MiniSidebar, ChatSidebar } from '@/components/NewSidebars';
import { playTTS } from '@/components/AIOrb';
import ChatMessages from '@/components/ChatMessages';
import InputBar from '@/components/InputBar';
import Suggestions from '@/components/Suggestions';
import WelcomeModal from '@/components/WelcomeModal';
import InfoModal from '@/components/InfoModal';
import StatsModal from '@/components/StatsModal';
import type { UserStats } from '@/components/StatsModal';
import type { Chat, Message } from '@/components/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://python-api-render-ubr9.onrender.com/ask';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<UserStats>({
    totalMessages: 0,
    totalCharsSent: 0,
    totalCharsReceived: 0,
    totalChatsCreated: 0,
    firstUse: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    activeDays: 1,
  });

  useEffect(() => {
    const saved = localStorage.getItem('nexus_chats');
    const name = localStorage.getItem('nexus_user');
    const dark = localStorage.getItem('theme') === 'dark';
    const savedStats = localStorage.getItem('nexus_stats');
    
    if (saved) setChats(JSON.parse(saved));
    if (name) {
      setUserName(name);
      setShowWelcome(false);
    }
    if (savedStats) setStats(JSON.parse(savedStats));
    
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');
    setLoaded(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchTrigger(prev => prev + 1);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        newChat();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('nexus_stats', JSON.stringify(stats));
    }
  }, [stats, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('nexus_chats', JSON.stringify(chats));
    }
  }, [chats, loaded]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const threshold = 100;
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > threshold);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [loaded]);

  const HEALTH_URL = API_URL.replace('/ask', '/health');

  useEffect(() => {
    if (!loaded) return;
    const ping = () => {
      fetch(HEALTH_URL).catch(() => {});
    };
    ping();
    const id = setInterval(ping, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loaded]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const save = (newChats: Chat[]) => {
    setChats(newChats);
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
    setStats(prev => ({ ...prev, totalChatsCreated: prev.totalChatsCreated + 1 }));
  };

  const loadChat = (id: string) => setCurrentId(id);

  const toggleFavorite = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    setCurrentId(prev => prev === id ? null : prev);
  };

  const renameChat = (id: string, title: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  };

  const currentChat = chats.find(c => c.id === currentId);
  const currentMsgs = currentChat ? currentChat.msgs : [];

  const handleSuggestion = (text: string) => {
    if (!currentId) {
      const id = uuidv4();
      const nc: Chat = { id, title: text.slice(0, 30), msgs: [], userName };
      const updated = [nc, ...chats];
      save(updated);
      setCurrentId(id);
      sendMessage(text, 'casual', id, updated);
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

    const today = new Date().toDateString();
    setStats(prev => {
      const lastActiveDate = new Date(prev.lastActive).toDateString();
      const diff = Math.floor((new Date().getTime() - new Date(prev.lastActive).getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...prev,
        totalMessages: prev.totalMessages + 1,
        totalCharsSent: prev.totalCharsSent + question.length,
        lastActive: new Date().toISOString(),
        activeDays: today !== lastActiveDate ? prev.activeDays + 1 : prev.activeDays,
      };
    });

    const history = activeList.find(c => c.id === activeId)?.msgs || [];

    const userMsg: Message = { t: 'u', x: question };
    const botMsg: Message = { t: 'b', x: '' };
    const updated = activeList.map(c => 
      c.id === activeId 
        ? { ...c, msgs: [...c.msgs, userMsg, botMsg], title: c.msgs.length === 0 ? question.slice(0, 30) : c.title } 
        : c
    );
    save(updated);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, question, personality, history }),
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      if (!res.body) throw new Error('Cuerpo de respuesta vacío');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        botAnswer += chunk;

        // Actualizamos el último mensaje (el del bot) con el texto acumulado
        setChats(prev => prev.map(c => 
          c.id === activeId 
            ? { 
                ...c, 
                msgs: c.msgs.map((m, idx) => 
                  idx === c.msgs.length - 1 ? { ...m, x: botAnswer } : m
                ) 
              } 
            : c
        ));
      }

      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        totalCharsReceived: prev.totalCharsReceived + botAnswer.length,
      }));
    } catch (err) {
      const errorMsg: Message = { t: 'b', x: 'No se pudo conectar con la IA. Verifica tu conexión.' };
      setChats(prev => prev.map(c => c.id === activeId ? { ...c, msgs: [...c.msgs, errorMsg] } : c));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans tracking-tight transition-colors duration-300">
      <MiniSidebar isDark={isDark} userName={userName} onToggleTheme={toggleTheme} onToggleStats={() => setShowStats(true)} />
      <ChatSidebar 
        chats={chats} 
        currentId={currentId} 
        onNewChat={newChat} 
        onLoadChat={loadChat}
        onToggleFavorite={toggleFavorite}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
        searchTrigger={searchTrigger}
      />

      <AnimatePresence>
        {showWelcome && <WelcomeModal onStart={startChat} />}
      </AnimatePresence>

      <main className="flex-1 ml-0 lg:ml-[320px] flex flex-col relative h-screen overflow-x-hidden pb-16 lg:pb-0">
        {/* Encabezado */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-gray-50 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <button 
              className="lg:hidden p-1.5 mr-1 text-zinc-600 dark:text-zinc-400 transition-colors duration-300"
              onClick={() => setMobileSidebar(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-medium text-zinc-900 dark:text-white transition-colors duration-300">Zenith GPT</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase transition-colors duration-300">PRO</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowInfo(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-normal text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Documentación
            </button>
            <a 
              href="https://sebas-dev.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-xs font-normal text-white dark:text-zinc-900 hover:opacity-90 transition-all duration-300"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              Portfolio Web
            </a>
            <button 
              onClick={() => playTTS("Hola, soy el orbe Zenith. Estoy listo para ayudarte con lo que necesites.")}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 text-white rounded-full text-xs font-normal hover:bg-indigo-600 transition-all duration-300 shadow-sm"
            >
              <Mic size={12} strokeWidth={1.5} />
              <span className="hidden sm:inline">Probar Voz</span>
            </button>
            <button 
              onClick={() => { newChat(); setMobileSidebar(false); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-normal hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 shadow-sm"
            >
              <Sparkles size={12} className="fill-white dark:fill-zinc-900" strokeWidth={1.5} />
              <span className="hidden sm:inline">Nuevo Chat</span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth flex flex-col max-[1399px]:pb-36">
          <AnimatePresence mode="wait">
            {currentMsgs.length === 0 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1"
              >
                <Suggestions onSuggestion={handleSuggestion} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="max-w-[900px] mx-auto w-full py-8"
              >
                <ChatMessages messages={currentMsgs} chatId={currentId} sending={sending} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-60 lg:bottom-[180px] left-4 lg:left-[340px] right-4 lg:right-8 flex justify-center pointer-events-none z-20">
          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                onClick={scrollToBottom}
                initial={{ opacity: 0, scale: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowDownToLine size={14} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <InputBar onSend={sendMessage} disabled={sending} />
      </main>

      <AnimatePresence>
        {showInfo && <InfoModal show={showInfo} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
      </AnimatePresence>
    </div>
  );
}
