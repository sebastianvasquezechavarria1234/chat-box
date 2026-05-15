import os
import json
import random
from groq import Groq
from dotenv import load_dotenv
from duckduckgo_search import DDGS

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_FAST = "llama-3.1-8b-instant"
MODEL_POWER = "llama-3.3-70b-versatile"

personalidades = {
  "casual": "Eres Zenith, una IA de vanguardia amigable. Responde en español fluido y usa el nombre del usuario ({name}).",
  "tutor": "Eres el Maestro Zenith, mentor experto. Usa analogías y el método socrático.",
  "profesional": "Eres el Consultor Zenith, experto en estrategia y ROI. Tono ejecutivo.",
  "tecnico": "Eres Zenith Core, Arquitecto de Software de élite. Código limpio y arquitectura sólida."
}

def search_web(query: str, max_results: int = 5) -> str:
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(f"Título: {r['title']}\nContenido: {r['body']}\nFuente: {r['href']}\n")
        return "\n---\n".join(results) if results else "No se encontraron resultados relevantes."
    except Exception as e:
        return f"Error en la búsqueda web: {str(e)}"

def generate_image_markdown(prompt: str) -> str:
    """
    Crea un enlace Markdown para generar una imagen vía Pollinations.ai.
    """
    seed = random.randint(1, 999999)
    # Limpiar el prompt para URL
    clean_prompt = prompt.replace(" ", "%20").replace('"', "").replace("'", "")
    image_url = f"https://pollinations.ai/p/{clean_prompt}?width=1024&height=1024&seed={seed}&model=flux"
    return f"\n\n![Imagen Generada: {prompt}]({image_url})\n*Imagen generada por Zenith AI usando Flux Model*\n"

def ask_groq(name: str, question: str, personality: str = "casual", history: list = None):
    system_prompt = personalidades.get(personality, personalidades["casual"]).replace("{name}", name)
    
    # Decisión de Herramienta (Búsqueda o Imagen)
    decision_prompt = f"""Analiza la pregunta: '{question}'
    Responde estrictamente con una sola palabra:
    - 'IMAGE': si el usuario pide crear, dibujar, generar o mostrar una imagen/foto.
    - 'SEARCH': si pide información actual, noticias, precios o datos del mundo real.
    - 'DIRECT': si es una charla normal, código o lógica sin necesidad de internet o imágenes."""
    
    decision = client.chat.completions.create(
        model=MODEL_FAST,
        messages=[{"role": "user", "content": decision_prompt}],
        max_tokens=10
    ).choices[0].message.content.strip().upper()

    context_info = ""
    image_addon = ""

    if "IMAGE" in decision:
        # Generar un prompt descriptivo en inglés para mejor calidad
        prompt_gen = client.chat.completions.create(
            model=MODEL_FAST,
            messages=[{"role": "user", "content": f"Transforma esta petición de imagen en un prompt detallado en inglés para una IA generativa (estilo cinematográfico, 4k): {question}"}],
            max_tokens=60
        ).choices[0].message.content.strip()
        image_addon = generate_image_markdown(prompt_gen)
        context_info = "\n\nSISTEMA: Estás generando una imagen. Confirma al usuario que la estás creando."
        print(f"DEBUG: Generando imagen con prompt: {prompt_gen}")

    elif "SEARCH" in decision:
        search_results = search_web(question)
        context_info = f"\n\nINFORMACIÓN ACTUALIZADA DE INTERNET:\n{search_results}\n"
        print("DEBUG: Búsqueda web integrada.")

    full_system_prompt = f"{system_prompt}\n\nREGLAS: No generes contenido ilegal.{context_info}"
    messages = [{"role": "system", "content": full_system_prompt}]
    
    if history:
        for msg in history[-10:]:
            role = "user" if msg["t"] == "u" else "assistant"
            messages.append({"role": role, "content": msg["x"]})
    
    messages.append({"role": "user", "content": f"{name} pregunta: {question}"})
    
    selected_model = MODEL_POWER if ("SEARCH" in decision or len(question) > 50) else MODEL_FAST

    stream = client.chat.completions.create(
        model=selected_model,
        temperature=0.5,
        messages=messages,
        stream=True,
    )
    
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
    
    if image_addon:
        yield image_addon
