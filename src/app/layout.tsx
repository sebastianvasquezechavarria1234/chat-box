import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat IA | Inteligencia Artificial Avanzada',
  description: 'Chatbot inteligente con IA potenciado por LLaMA 3.3 y FastAPI.',
  keywords: 'AI, Chatbot, LLaMA, FastAPI, Python, Groq',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-blue-50 min-h-screen">{children}</body>
    </html>
  );
}
