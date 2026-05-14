'use client';

import { 
  Calendar, 
  Layers, 
  FileText, 
  CheckCircle2, 
  MoreHorizontal,
  Layout
} from 'lucide-react';

interface Props {
  onSuggestion: (text: string) => void;
}

export default function Suggestions({ onSuggestion }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-[1000px] mx-auto w-full py-12">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center mb-8 shadow-sm">
        <Layout className="text-white dark:text-zinc-900" size={32} />
      </div>
      <h1 className="text-4xl font-medium text-zinc-900 dark:text-white mb-2 tracking-tight">¡Hola! 👋</h1>
      <p className="text-zinc-400 dark:text-zinc-500 text-lg mb-12 font-light">Cuéntanos qué necesitas y nosotros nos encargamos.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-10">
        {/* Zenith Analytics Card */}
        <div className="bg-[#0F172A] rounded-[32px] p-7 text-white flex flex-col h-[230px] shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.02]">
           <div className="flex items-center justify-between mb-5">
             <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">Z</div>
                <span className="text-sm font-semibold">Zenith Intelligence</span>
             </div>
             <span className="bg-indigo-600/30 text-indigo-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-indigo-500/20">Análisis</span>
           </div>
           <p className="text-sm text-zinc-300 leading-relaxed flex-1 font-light">
             Capaz de analizar grandes volúmenes de datos, extraer conclusiones clave y generar reportes profesionales en segundos.
           </p>
        </div>

        {/* Zenith Tasks Card */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-7 border border-gray-100 dark:border-zinc-800 flex flex-col h-[230px] shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center gap-2 mb-5 text-zinc-400">
             <Layers size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Productividad</span>
           </div>
           <div className="flex flex-col gap-3 flex-1">
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-light">
               <CheckCircle2 size={16} className="text-green-500" />
                <span>Gestión de flujos de trabajo</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-light">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Automatización de correos</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-light">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Resumen de documentos extensos</span>
             </div>
           </div>
             <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right hover:text-indigo-500 transition-colors">Capacidades</button>
        </div>

        {/* Suggested Prompt Card */}
        <div 
          className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-7 border border-gray-100 dark:border-zinc-800 flex flex-col h-[230px] shadow-sm group cursor-pointer hover:border-indigo-100 transition-all" 
          onClick={() => onSuggestion('¿Cómo puede Zenith GPT ayudarme a mejorar mi productividad diaria?')}
        >
           <div className="flex items-center justify-between mb-5">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Comenzar ahora</span>
             <MoreHorizontal size={18} className="text-zinc-300" />
           </div>
           <p className="text-[15px] text-zinc-800 dark:text-zinc-100 font-light leading-relaxed flex-1">
             "¿Cómo puede Zenith GPT ayudarme a optimizar mis tareas diarias y mejorar la calidad de mis entregas?"
           </p>
           <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Hacer esta pregunta</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={() => onSuggestion('Ayúdame a conectar mi calendario para organizar mis reuniones.')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-light text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Calendar size={14} className="text-red-400" /> Conectar calendario
        </button>
        <button 
          onClick={() => onSuggestion('Muéstrame una tarea demo de cómo Zenith GPT analiza un documento.')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-light text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Layers size={14} className="text-blue-400" /> Tarea demo
        </button>
        <button 
          onClick={() => onSuggestion('¿Qué integraciones tiene Zenith GPT disponibles actualmente?')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-light text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Layout size={14} className="text-orange-400" /> Explorar integraciones
        </button>
        <button 
          onClick={() => onSuggestion('Muéstrame las notas que se han compartido recientemente en el equipo.')}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-light text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <FileText size={14} className="text-green-400" /> Compartido en notas
        </button>
      </div>
    </div>
  );
}
