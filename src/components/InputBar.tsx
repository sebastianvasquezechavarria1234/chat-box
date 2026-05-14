'use client';

import { useState } from 'react';

interface Props {
  onSend: (question: string, personality: string) => void;
  disabled: boolean;
}

const personalities = ['casual', 'tutor', 'profesional', 'tecnico'];

export default function InputBar({ onSend, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [personality, setPersonality] = useState('casual');

  const handleSend = () => {
    const q = question.trim();
    if (!q || disabled) return;
    onSend(q, personality);
    setQuestion('');
  };

  return (
    <div className="fixed bottom-[10px] left-[250px] right-[10px] flex flex-col items-center gap-0.5">
      <div className="w-full max-w-[800px] relative">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          maxLength={500}
          placeholder="Pregúntame algo..."
          disabled={disabled}
          className="w-full rounded-full border border-gray-200 shadow-xl outline-none bg-white"
          style={{ padding: '20px 200px 20px 20px', fontSize: 18 }}
        />
        <select
          value={personality}
          onChange={e => setPersonality(e.target.value)}
          className="absolute top-1.5 right-16 bg-purple-200 py-2.5 px-4 rounded-full border border-gray-100 text-sm cursor-pointer outline-none"
          style={{ height: 55 }}
        >
          {personalities.map(p => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={handleSend}
          disabled={disabled}
          title="Enviar mensaje"
          className="absolute right-1.5 top-1.5 bg-purple-600 hover:bg-purple-400 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center rounded-full transition"
          style={{ width: 55, height: 55 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
            <path d="M6 12h16"/>
          </svg>
        </button>
      </div>
      <a
        href="https://sebas-dev.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-400 hover:underline text-center"
      >
        © 2026 Desarrollado por: Sebastian Vasquez Echavarria
      </a>
    </div>
  );
}
