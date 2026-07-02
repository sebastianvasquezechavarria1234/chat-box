'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import AIOrb, { playTTS } from './AIOrb';

interface Props {
  onClose: () => void;
  userName: string;
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking';

export default function VoiceSessionModal({ onClose, userName }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [displayText, setDisplayText] = useState('Toca el micrófono para comenzar');
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);

  // Inicializar SpeechRecognition una sola vez
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setDisplayText('Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
      return;
    }

    const rec = new SR();
    rec.lang = 'es-ES';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onstart = () => {
      setStatus('listening');
      setDisplayText('Escuchándote...');
      transcriptRef.current = '';
    };

    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          transcriptRef.current += t;
        } else {
          interim = t;
        }
      }
      setDisplayText(transcriptRef.current || interim || 'Escuchándote...');
    };

    rec.onend = () => {
      if (isProcessingRef.current) return;
      const text = transcriptRef.current.trim();
      if (text.length > 0) {
        isProcessingRef.current = true;
        handleAIResponse(text);
      } else {
        setStatus('idle');
        setDisplayText('No te escuché. Toca el micrófono e intenta de nuevo.');
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech error:', e.error);
      setStatus('idle');
      setDisplayText(
        e.error === 'not-allowed'
          ? 'Permiso de micrófono denegado. Actívalo en tu navegador.'
          : 'Error al escuchar. Intenta de nuevo.'
      );
    };

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || status === 'thinking' || status === 'speaking') return;
    try {
      recognitionRef.current.start();
    } catch (_) {}
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const handleMicClick = () => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'idle') {
      startListening();
    }
  };

  const handleAIResponse = async (text: string) => {
    setStatus('thinking');
    setDisplayText('Procesando tu pregunta...');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://python-api-render-ubr9.onrender.com/ask';
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, question: text, personality: 'casual', history: [] }),
      });

      if (!res.body) throw new Error('Sin respuesta');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
      }

      setStatus('speaking');
      setDisplayText(answer.slice(0, 120) + (answer.length > 120 ? '...' : ''));
      await playTTS(answer);

    } catch (err) {
      console.error(err);
      setDisplayText('Error al contactar la IA. Intenta de nuevo.');
    } finally {
      isProcessingRef.current = false;
      setStatus('idle');
      // Escuchar de nuevo automáticamente
      setTimeout(() => startListening(), 800);
    }
  };

  const statusLabel: Record<Status, string> = {
    idle: 'MODO VOZ · ZENITH',
    listening: 'ESCUCHANDO',
    thinking: 'PROCESANDO',
    speaking: 'RESPONDIENDO',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-[#030303] overflow-hidden"
    >
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,51,196,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between px-8 pt-8 z-10">
        <span className="text-white/40 text-xs font-light tracking-[0.3em]">
          {statusLabel[status]}
        </span>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/80 transition-colors text-xs tracking-widest"
        >
          ESC
        </button>
      </div>

      {/* Orbe centrado */}
      <div className="flex-1 flex items-center justify-center w-full pointer-events-none">
        <AIOrb size="lg" />
      </div>

      {/* Texto del transcript / estado */}
      <div className="w-full text-center px-8 pb-6 min-h-[60px] flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={displayText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-white/70 text-base font-light max-w-xl leading-relaxed"
          >
            {displayText}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Controles */}
      <div className="flex gap-8 items-center pb-14 z-10">
        {/* Botón Micrófono */}
        <button
          onClick={handleMicClick}
          disabled={status === 'thinking' || status === 'speaking'}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            ${status === 'listening'
              ? 'bg-indigo-500/20 border border-indigo-400/60 text-indigo-300'
              : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }
          `}
        >
          {/* Pulso mientras escucha */}
          {status === 'listening' && (
            <span className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping" />
          )}
          {status === 'listening' ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

        {/* Botón Colgar */}
        <button
          onClick={onClose}
          className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)]"
        >
          <PhoneOff size={26} />
        </button>
      </div>
    </motion.div>
  );
}
