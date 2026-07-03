import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zenith GPT',
  description: 'Chatbot inteligente con IA potenciado por LLaMA 3.3 y FastAPI.',
  keywords: 'AI, Chatbot, LLaMA, FastAPI, Python, Groq',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth dark">
      <body className="bg-blue-50 dark:bg-zinc-950 min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
