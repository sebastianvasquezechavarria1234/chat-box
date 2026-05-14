'use client';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function InfoModal({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-y-auto"
        style={{ width: 680, maxHeight: '85vh', padding: '2rem' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-gray-800">Documentación del Proyecto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold bg-transparent border-none cursor-pointer">✕</button>
        </div>

        <section className="mb-6">
          <h3 className="text-purple-700 text-base mb-2">¿Qué es este proyecto?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Es un <strong>chatbot con IA</strong> que funciona como intermediario entre el usuario y un modelo de lenguaje.
            El frontend (Next.js + Tailwind) captura la pregunta del usuario y la envía a una API propia construida en Python.
            Esa API se comunica con <strong>Groq</strong> usando el modelo <strong>LLaMA 3.3 70B</strong> para generar una respuesta inteligente y personalizada.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-purple-700 text-base mb-2">¿Cómo funciona?</h3>
          <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-loose border border-gray-100">
            <p> <strong>Usuario</strong> escribe una pregunta en el frontend</p>
            <p> <strong>Vercel</strong> sirve el frontend (Next.js)</p>
            <p> <strong>fetch()</strong> en JavaScript hace un <code className="bg-purple-100 px-1 rounded">POST</code> a la API</p>
            <p> <strong>FastAPI (Python)</strong> recibe la petición en el endpoint <code className="bg-purple-100 px-1 rounded">POST /ask</code></p>
            <p> <strong>Groq API</strong> procesa la pregunta con LLaMA 3.3 70B</p>
            <p> La respuesta regresa al frontend y se escribe con efecto <strong>typewriter</strong></p>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-purple-700 text-base mb-2">¿Cómo probar la API con Thunder Client?</h3>
          <p className="text-sm text-gray-500 mb-3">Puedes probar el endpoint directamente sin necesidad del frontend:</p>
          <div className="bg-gray-900 rounded-2xl p-4 text-sm flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">POST</span>
              <code className="text-green-400">https://python-api-render-ubr9.onrender.com/ask</code>
            </div>
            <hr className="border-gray-700" />
            <p className="text-gray-400 text-xs">Body - JSON:</p>
            <pre className="text-yellow-300 text-xs leading-relaxed">{`{
  "name": "Sebastian",
  "question": "\u00bfQu\u00e9 es la inteligencia artificial?",
  "personality": "casual"
}`}</pre>
            <hr className="border-gray-700" />
            <p className="text-gray-400 text-xs">Respuesta esperada:</p>
            <pre className="text-blue-300 text-xs">{`{
  "answer": "\u00a1Hola Sebastian! La IA es..."
}`}</pre>
          </div>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <strong>Nota:</strong> La API est&aacute; en Render con plan gratuito. Si lleva tiempo inactiva, la primera petici&oacute;n puede tardar 30&ndash;60 segundos en responder mientras el servidor se reactiva.
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Valores disponibles para <code className="bg-gray-100 px-1 rounded">personality</code>:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">casual</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">tutor</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">profesional</span>
              <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">tecnico</span>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-purple-700 text-base mb-2">Stack tecnol&oacute;gico</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><strong>Backend:</strong> Python + FastAPI</div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><strong>Frontend:</strong> Next.js + Tailwind CSS</div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"> <strong>IA:</strong> Groq &mdash; LLaMA 3.3 70B</div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"> <strong>Historial:</strong> localStorage</div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"> <strong>API Deploy:</strong> Render</div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"> <strong>Frontend Deploy:</strong> Vercel</div>
          </div>
        </section>

        <section className="bg-purple-50 rounded-2xl p-4 text-sm text-gray-600 border border-purple-100">
          <p> <strong>Autor:</strong> Sebastian Vasquez Echavarria</p>
          <p> <strong>Portafolio:</strong> <a href="https://sebas-dev.vercel.app/" target="_blank" className="text-purple-600 hover:underline">sebas-dev.vercel.app</a></p>
          <p> <strong>GitHub:</strong> <a href="https://github.com/sebastianvasquezechavarria1234/python-api-render" target="_blank" className="text-purple-600 hover:underline">python-api-render</a></p>
        </section>
      </div>
    </div>
  );
}
