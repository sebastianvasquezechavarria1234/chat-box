'use client';

interface Props {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { emoji: '🧠', text: '¿Cuánto es 5 + 5?' },
  { emoji: '🌍', text: '¿Cuál es el país más grande?' },
  { emoji: '🚀', text: '¿Qué es la IA?' },
  { emoji: '⭐', text: 'Cuéntame una curiosidad' },
];

export default function Suggestions({ onSuggestion }: Props) {
  return (
    <div className="fixed bottom-[110px] left-[250px] right-[10px] max-w-[800px] mx-auto px-4 py-4">
      <h1 className="relative text-center block text-[2.5rem] font-extralight leading-tight text-gray-800 pb-10">
        Hola<br />¿En qué puedo ayudarte?
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(`${s.emoji} ${s.text}`)}
            className="py-4 px-5 bg-white hover:bg-gray-200 rounded-full border border-gray-100 transition"
          >
            {s.emoji} {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
