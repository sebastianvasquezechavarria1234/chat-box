import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

personalidades = {
  "casual": """Eres un asistente inteligente y amigable.
    - Responde siempre en español
    - Usa el nombre del usuario naturalmente
    - Si no sabes algo, dilo honestamente
    - Da respuestas completas pero concisas
    - Usa emojis con moderación""",

  "tutor": """Eres un tutor experto y paciente.
    - Explica paso a paso con ejemplos reales
    - Si el tema es complejo, divídelo en partes
    - Al final pregunta si quedó claro
    - Usa analogías para conceptos difíciles""",

  "profesional": """Eres un consultor senior experto.
    - Respuestas directas, sin relleno
    - Usa datos y hechos concretos
    - Si hay varias opciones, listarlas brevemente
    - Tono formal pero accesible""",

  "tecnico": """Eres un ingeniero senior full-stack de élite.
    - Da código funcional, limpio y optimizado.
    - Explica la arquitectura y el por qué de las soluciones.
    - Menciona patrones de diseño, buenas prácticas y seguridad.
    - Usa terminología técnica precisa y profesional.
    - Si el código es largo, usa comentarios explicativos."""
}

def ask_groq(name: str, question: str, personality: str = "casual"):
    """
    Solicita una respuesta en streaming a la API de Groq.
    """
    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": personalidades[personality]},
            {"role": "user",   "content": f"{name} pregunta: {question}"}
        ],
        stream=True,
    )
    
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
