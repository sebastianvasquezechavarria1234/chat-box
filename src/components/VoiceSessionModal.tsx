'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import AIOrb, { playTTS } from './AIOrb';

interface Props {
  onClose: () => void;
  userName: string;
}

export default function VoiceSessionModal({ onClose, userName }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('listening');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Usamos una pequeña pausa para asegurar que capturó el último estado del state
        setTimeout(() => {
          const finalTranscript = recognition.transcriptBackup || transcript;
          if (finalTranscript.trim().length > 0) {
            handleUserFinishedSpeaking(finalTranscript);
          } else {
            setStatus('idle');
          }
        }, 100);
      };

      // Truco para guardar el transcript final antes del onend
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        recognition.transcriptBackup = result;
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []); // Removemos transcript de dependencias para evitar recrear

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        recognitionRef.current.transcriptBackup = '';
        recognitionRef.current.start();
      }
    }
  };

  const handleUserFinishedSpeaking = async (text: string) => {
    setStatus('thinking');
    
    try {
      // 1. Enviar a tu backend Llama (Groq)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://python-api-render-ubr9.onrender.com/ask';
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, question: text, personality: 'casual', history: [] }),
      });

      if (!res.body) throw new Error('Cuerpo vacío');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botAnswer += decoder.decode(value, { stream: true });
      }

      setTranscript(''); // Limpiar lo que dijo el usuario

      // 2. Reproducir voz con ElevenLabs
      setStatus('speaking');
      await playTTS(botAnswer);
      
      setStatus('idle');
      
      // Auto-escuchar de nuevo (conversación continua)
      setTimeout(() => {
        toggleListen();
      }, 500);

    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center"
    >
      {/* Indicador superior */}
      <div className="absolute top-16 text-center w-full px-4">
        <h2 className="text-white/80 text-sm font-light tracking-[0.3em] uppercase mb-6">
          {status === 'idle' && 'Llamada Iniciada'}
          {status === 'listening' && 'Escuchando...'}
          {status === 'thinking' && 'Procesando...'}
          {status === 'speaking' && 'Respondiendo'}
        </h2>
        {transcript && (
          <p className="text-white/90 max-w-2xl mx-auto text-2xl font-light">
            &quot;{transcript}&quot;
          </p>
        )}
      </div>

      {/* El Orbe Centrado Gigante */}
      <div className="flex-1 w-full h-full flex items-center justify-center pointer-events-none pb-20">
        <div className="scale-[1.3] sm:scale-[1.8] transform">
          <AIOrb size="lg" />
        </div>
      </div>

      {/* Controles flotantes */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4 w-full">
        <p className="text-white/60 text-xs tracking-widest uppercase">
          {isListening ? "¡Habla ahora!" : "Toca el micrófono para hablar"}
        </p>
        <div className="flex gap-6 items-center">
          <button 
            onClick={toggleListen}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' 
                : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}
          >
            {isListening ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button 
            onClick={onClose}
            title="Terminar Llamada"
            className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
