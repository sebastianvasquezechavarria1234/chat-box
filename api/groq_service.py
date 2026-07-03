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
  "casual": "Eres Zenith, una IA de vanguardia amigable. Responde en español fluido y usa el nombre del usuario ({name}). Formato conversacional natural, como si hablaras con un amigo. CONTROL DE EMOJIS: Usa menos de 4 emojis por respuesta y solo cuando sea verdaderamente necesario.",
  "tutor": "Eres el Maestro Zenith, mentor experto. Usa analogías y el método socrático. Estructura tu respuesta así:\n  1. Explicación del concepto\n  2. Analogía o ejemplo práctico\n  3. Conclusión o ejercicio para reforzar\nCONTROL DE EMOJIS: Usa menos de 2 emojis por respuesta y solo cuando sea verdaderamente necesario.",
  "profesional": "Eres el Consultor Zenith, experto en estrategia y ROI. Tono ejecutivo, formal y sobrio. Estructura tu respuesta así:\n  - Resumen ejecutivo\n  - Análisis con datos concretos\n  - Recomendaciones accionables\n  - Next steps\nCONTROL DE EMOJIS: Usa menos de 2 emojis por respuesta y solo cuando sea verdaderamente necesario.",
  "tecnico": "Eres Zenith Core, Arquitecto de Software de élite. Código limpio y arquitectura sólida. Estructura tu respuesta así:\n  ## Análisis\n  ## Solución propuesta\n  ## Código / Implementación\n  ## Consideraciones técnicas\nCONTROL DE EMOJIS: Usa menos de 2 emojis por respuesta y solo cuando sea verdaderamente necesario."
}

TEMPERATURE = 0.8
MAX_HISTORY = 5

def search_web(query: str, max_results: int = 5) -> str:
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(f"- **{r['title']}**\n  {r['body']}\n  [Ver fuente]({r['href']})")
        return "\n\n".join(results) if results else "No se encontraron resultados relevantes."
    except Exception as e:
        return f"Error en la búsqueda web: {str(e)}"


def generate_image_markdown(prompt: str) -> str:
    seed = random.randint(1, 999999)
    clean_prompt = prompt.replace(" ", "%20").replace('"', "").replace("'", "")
    image_url = f"https://pollinations.ai/p/{clean_prompt}?width=1024&height=1024&seed={seed}&model=flux"
    return f"\n\n![Imagen Generada: {prompt}]({image_url})\n*Imagen generada por Zenith AI usando Flux Model*\n"


def llamar_modelo(model: str, messages: list, stream: bool = True, max_tokens: int = None):
    kwargs = dict(model=model, messages=messages, temperature=TEMPERATURE, stream=stream)
    if max_tokens:
        kwargs["max_tokens"] = max_tokens
    return client.chat.completions.create(**kwargs)


def resumir_historial(history: list, name: str) -> str:
    texto = "\n".join(
        f"{name if m['t'] == 'u' else 'Zenith'}: {m['x']}" for m in history
    )
    prompt = f"Resume esta conversación en 2-3 oraciones, captando los temas clave y el contexto:\n\n{texto}"
    try:
        resumen = llamar_modelo(MODEL_FAST, [{"role": "user", "content": prompt}], stream=False, max_tokens=150)
        return resumen.choices[0].message.content.strip()
    except:
        return ""


def detectar_idioma(texto: str) -> str:
    prompt = f"Responde ÚNICAMENTE con el código ISO del idioma (es, en, pt, fr, de, it, etc.) de este texto:\n\n{texto}"
    try:
        resp = llamar_modelo(MODEL_FAST, [{"role": "user", "content": prompt}], stream=False, max_tokens=5)
        return resp.choices[0].message.content.strip().lower()[:2]
    except:
        return "es"


def detectar_ambiguedad(question: str) -> str:
    prompt = f"""Analiza esta pregunta y determina si es ambigua (puede interpretarse de múltiples formas):
'{question}'
Responde ÚNICAMENTE con:
- 'CLARO' si está clara y directa
- 'AMBIGUO' si necesita más contexto o tiene múltiples interpretaciones posibles"""
    try:
        resp = llamar_modelo(MODEL_FAST, [{"role": "user", "content": prompt}], stream=False, max_tokens=10)
        return resp.choices[0].message.content.strip().upper()
    except:
        return "CLARO"


def ask_groq(name: str, question: str, personality: str = "casual", history: list = None):
    system_prompt = personalidades.get(personality, personalidades["casual"]).replace("{name}", name)

    # --- Detección de idioma ---
    lang = detectar_idioma(question)
    lang_rule = ""
    if lang == "en":
        lang_rule = "\nResponde en inglés."
    elif lang == "pt":
        lang_rule = "\nResponde en portugués."
    elif lang != "es":
        lang_rule = f"\nResponde en el mismo idioma de la pregunta (detectado: {lang})."

    # --- Decisión de Herramienta ---
    decision_prompt = f"""Analiza la pregunta: '{question}'
Responde estrictamente con una sola palabra:
- 'IMAGE': si el usuario pide crear, dibujar, generar o mostrar una imagen/foto.
- 'SEARCH': si pide información actual, noticias, precios o datos del mundo real.
- 'DIRECT': si es una charla normal, código o lógica sin necesidad de internet o imágenes."""

    decision = llamar_modelo(MODEL_FAST, [{"role": "user", "content": decision_prompt}], stream=False, max_tokens=10)
    decision_text = decision.choices[0].message.content.strip().upper()

    # --- Clarificación automática ---
    clarificacion = ""
    if decision_text == "DIRECT":
        ambiguedad = detectar_ambiguedad(question)
        if ambiguedad == "AMBIGUO":
            clarificacion = ("\n\nIMPORTANTE: La pregunta del usuario puede ser ambigua. "
                             "Antes de responder, pídele amablemente que aclare a qué se refiere. "
                             "Sé específico con las opciones que identificaste.")

    context_info = ""
    image_addon = ""

    if "IMAGE" in decision_text:
        prompt_gen = llamar_modelo(
            MODEL_FAST,
            [{"role": "user", "content": f"Transforma esta petición de imagen en un prompt detallado en inglés para una IA generativa (estilo cinematográfico, 4k): {question}"}],
            stream=False, max_tokens=60
        )
        prompt_gen_text = prompt_gen.choices[0].message.content.strip()
        image_addon = generate_image_markdown(prompt_gen_text)
        context_info = "\n\nSISTEMA: Estás generando una imagen. Confirma al usuario que la estás creando."
        print(f"DEBUG: Generando imagen con prompt: {prompt_gen_text}")

    elif "SEARCH" in decision_text:
        search_results = search_web(question)
        context_info = f"\n\nINFORMACIÓN ACTUALIZADA DE INTERNET (cita las fuentes usando [Ver fuente](url) cuando uses esta info):\n{search_results}\n"
        print("DEBUG: Búsqueda web integrada.")

    format_rule = ""
    if personality == "tecnico":
        format_rule = "\n\nUsa el formato markdown con títulos, subtítulos y bloques de código cuando sea relevante."
    elif personality == "profesional":
        format_rule = "\n\nUsa listas, negritas y separadores para organizar la información."

    full_system_prompt = f"{system_prompt}{lang_rule}{format_rule}{clarificacion}\n\nREGLAS ESTRICTAS:\n- No generes contenido ilegal.\n- EMOJIS: Sigue EXACTAMENTE las instrucciones de CONTROL DE EMOJIS de tu personalidad. NUNCA uses más emojis de los indicados. Si dice 0, usa 0. Si dice máximo 1, usa 0 o 1. Menos es mejor. No pongas emojis decorativos ni en listas.{context_info}"
    messages = [{"role": "system", "content": full_system_prompt}]

    if history:
        if len(history) > MAX_HISTORY:
            resumen = resumir_historial(history[:-MAX_HISTORY], name)
            if resumen:
                messages.append({"role": "system", "content": f"Resumen de la conversación anterior: {resumen}"})
        for msg in history[-MAX_HISTORY:]:
            role = "user" if msg["t"] == "u" else "assistant"
            messages.append({"role": role, "content": msg["x"]})

    messages.append({"role": "user", "content": f"{name} pregunta: {question}"})

    selected_model = MODEL_POWER if ("SEARCH" in decision_text or len(question) > 50) else MODEL_FAST

    try:
        stream = llamar_modelo(selected_model, messages)
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        print(f"DEBUG: Error con modelo {selected_model}: {e}. Intentando fallback...")
        fallback_model = MODEL_FAST if selected_model == MODEL_POWER else MODEL_POWER
        try:
            stream = llamar_modelo(fallback_model, messages)
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e2:
            print(f"DEBUG: Error también con fallback {fallback_model}: {e2}")
            yield f"\n\nLo siento, {name}, tuve un problema técnico. Por favor intenta de nuevo. 🙏"

    if image_addon:
        yield image_addon
