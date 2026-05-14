'use client';

import { 
  Calendar, 
  Layers, 
  FileText, 
  CheckCircle2, 
  MessageSquarePlus, 
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
        {/* Assistant Card */}
        <div className="bg-[#0F172A] rounded-[32px] p-7 text-white flex flex-col h-[220px] shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.02]">
           <div className="flex items-center justify-between mb-5">
             <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">S</div>
                <span className="text-sm font-semibold">Carlos García</span>
             </div>
             <span className="bg-blue-600/30 text-blue-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-blue-500/20">Asistente de datos</span>
           </div>
           <p className="text-sm text-zinc-300 leading-relaxed flex-1 font-medium">
             Diseñado para ayudar a gestionar procesos de ventas y maximizar la interacción con clientes.
           </p>
        </div>

        {/* Tasks Card */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-7 border border-gray-100 dark:border-zinc-800 flex flex-col h-[220px] shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center gap-2 mb-5 text-zinc-400">
             <Layers size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Tareas</span>
           </div>
           <div className="flex flex-col gap-4 flex-1">
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
               <FileText size={16} className="text-zinc-300" />
                <span>Responder documentación RFP</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                <CheckCircle2 size={16} className="text-zinc-300" />
                <span>Realizar análisis de competencia</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                <MessageSquarePlus size={16} className="text-zinc-300" />
                <span>Dar retroalimentación de comunicación</span>
             </div>
           </div>
            <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right hover:text-blue-500 transition-colors">Ver todo</button>
        </div>

        {/* Suggested Prompt Card */}
        <div 
          className="bg-white dark:bg-zinc-900/50 rounded-[32px] p-7 border border-gray-100 dark:border-zinc-800 flex flex-col h-[220px] shadow-sm group cursor-pointer hover:border-blue-100 transition-all" 
          onClick={() => onSuggestion('¿Cuáles son los beneficios clave del Producto 1?')}
        >
           <div className="flex items-center justify-between mb-5">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Sugerencia</span>
             <MoreHorizontal size={18} className="text-zinc-300" />
           </div>
           <p className="text-[15px] text-zinc-800 dark:text-zinc-100 font-semibold leading-relaxed flex-1">
             ¿Cuáles son los beneficios clave del Producto 1 que debería destacar a clientes potenciales?
           </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95">
          <Calendar size={14} className="text-red-400" /> Conectar calendario
        </button>
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95">
          <Layers size={14} className="text-blue-400" /> Tarea demo
        </button>
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95">
          <Layout size={14} className="text-orange-400" /> Explorar integraciones
        </button>
        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all active:scale-95">
          <FileText size={14} className="text-green-400" /> Compartido en notas
        </button>
      </div>
    </div>
  );
}
