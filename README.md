<div align="center">

  <img src="public/logo.png" alt="Zenith GPT Logo" width="120" style="border-radius: 24px;" />

  # Zenith GPT

  **Chatbot inteligente con IA de última generación.**

  Potenciado por LLaMA 3.3, FastAPI y una interfaz que respira.

  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.app)
  [![License: MIT](https://img.shields.io/badge/Licencia-MIT-8B5CF6?style=flat-square)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)](https://nextjs.org)
  [![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=flat-square&logo=python)](https://fastapi.tiangolo.com)

  ---
</div>

## Tabla de contenidos

- [Una mirada al proyecto](#una-mirada-al-proyecto)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Getting started](#getting-started)
- [Variables de entorno](#variables-de-entorno)
- [API](#api)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Personalización](#personalización)
- [Autor](#autor)
- [Licencia](#licencia)

---

## Una mirada al proyecto

> *Zenith GPT nace de una pregunta simple: ¿y si una IA pudiera sentirse viva?*

No es solo un chatbot. Es una experiencia visual y conversacional donde cada interacción tiene peso. Un orbe 3D reacciona al mouse, al ritmo de la voz, al contexto de la charla. Mientras la IA piensa, la interfaz también respira.

El backend funciona como un **sistema multi-agente**: detecta el idioma del usuario, analiza si la pregunta es ambigua, decide si necesita buscar en internet o generar una imagen, y elige automáticamente el modelo más adecuado. Todo esto sucede en milisegundos, antes de que la primera palabra llegue a pantalla.

---

## Características

| Capacidades | Detalle |
|:---|:---|
| **Streaming en tiempo real** | Las respuestas aparecen carácter por carácter, sin esperas. |
| **4 personalidades** | Casual, Tutor, Profesional y Técnico — cada una con su propio tono y estructura. |
| **Búsqueda web integrada** | Cuando la pregunta requiere datos actuales, Zenith busca en DuckDuckGo y cita fuentes. |
| **Generación de imágenes** | Pide una imagen y Zenith la crea con Flux a través de Pollinations.ai. |
| **Detección de idioma** | Responde en español, inglés, portugués o cualquier idioma detectado automáticamente. |
| **Clarificación automática** | Si la pregunta es ambigua, pide contexto antes de responder. |
| **Gestión de conversaciones** | Crear, renombrar, buscar, favoritos y eliminar chats. |
| **Estadísticas de uso** | Mensajes, caracteres, días activos — todo almacenado localmente. |
| **Tema claro y oscuro** | Un toggle, transición suave, cero destellos. |
| **Atajos de teclado** | `Ctrl+N` para nuevo chat, `Ctrl+K` para buscar. |

### El orbe 3D

El orbe no es decoración. Es una esfera metálica con *iridiscencia*, *clearcoat* y shaders personalizados de ruido simplex que reaccionan a tres estímulos:

- **El mouse** — al pasar sobre él, la esfera se distorsiona y las partículas orbitantes se aceleran.
- **El audio** — cuando la IA habla (TTS), la frecuencia del sonido modifica la geometría en tiempo real.
- **El tiempo** — la esfera respira orgánicamente, como si tuviera pulso propio.

---

## Stack tecnológico

### Frontend

| Tecnología | Uso |
|:---|:---|
| **Next.js 14** | Framework React con App Router y server components. |
| **React 18** | UI declarativa con hooks y server-side rendering. |
| **TypeScript** | Type safety en todo el proyecto. |
| **Tailwind CSS** | Estilos utility-first con modo oscuro por clase. |
| **Three.js** | Renderizado 3D del orbe con React Three Fiber. |
| **Framer Motion** | Animaciones declarativas: blur, spring, layout animations. |
| **react-markdown** | Renderizado de markdown con syntax highlighting. |
| **Lucide React** | Iconografía limpia y consistente. |

### Backend

| Tecnología | Uso |
|:---|:---|
| **Python** | Lenguaje del backend. |
| **FastAPI** | API asíncrona con streaming nativo. |
| **Groq API** | Acceso a LLaMA 3.3 70B y LLaMA 3.1 8B. |
| **DuckDuckGo Search** | Búsqueda web en tiempo real. |
| **Pollinations.ai** | Generación de imágenes con Flux. |
| **Pydantic** | Validación de esquemas de request. |

### Despliegue

| Servicio | Rol |
|:---|:---|
| **Vercel** | Frontend — deploy automático desde GitHub. |
| **Render** | Backend — API con streaming y cold start en plan gratuito. |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vercel)                    │
│                                                         │
│   Next.js 14  ──►  React 18  ──►  Three.js / Canvas    │
│        │                │                │               │
│   Tailwind CSS     Framer Motion    R3F + PostFX        │
│                                                         │
│              Streaming fetch (POST /ask)                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (Render)                      │
│                                                         │
│   FastAPI  ──►  Orquestador de Agentes                  │
│                    │                                    │
│        ┌───────────┼───────────────┐                    │
│        ▼           ▼               ▼                    │
│   Groq API    DuckDuckGo     Pollinations.ai            │
│   (LLaMA)    (Búsqueda)     (Imágenes Flux)            │
│                                                         │
│   Idioma  ─►  Ambigüedad  ─►  Decisión  ─►  Stream    │
└─────────────────────────────────────────────────────────┘
```

### Flujo de una conversación

1. El usuario escribe una pregunta en el chat.
2. El frontend envía un `POST` con streaming al endpoint `/ask`.
3. El backend **detecta el idioma** de la pregunta.
4. Analiza si la pregunta es **ambigua** y decide si pedir clarificación.
5. Evalúa si requiere **búsqueda web**, **generación de imagen** o **respuesta directa**.
6. Selecciona el modelo adecuado: **LLaMA 3.3 70B** para tareas complejas, **LLaMA 3.1 8B** para rápidas.
7. La respuesta se transmite **chunk por chunk** de vuelta al frontend.
8. El orbe 3D reacciona visualmente al contenido siendo generado.

---

## Getting started

### Requisitos

- Node.js >= 18.17.0
- Python 3.10+
- Una API key de [Groq](https://console.groq.com)

### Instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/sebastianvasquezechavarria1234/python-api-render.git
cd python-api-render
```

**2. Frontend**

```bash
npm install
cp .env.local.example .env.local   # configurar variables
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`.

**3. Backend**

```bash
pip install -r requirements.txt
cp .env.example .env               # configurar variables
uvicorn api.main:app --reload --port 8000
```

La API estará disponible en `http://localhost:8000`.

> **Nota:** La API desplegada en Render entra en reposo tras inactividad. La primera petición puede tardar 30–60 segundos mientras se reactiva el servidor.

---

## Variables de entorno

### Frontend (`.env.local`)

| Variable | Descripción | Ejemplo |
|:---|:---|:---|
| `NEXT_PUBLIC_API_URL` | URL del endpoint `/ask` del backend | `https://python-api-render-ubr9.onrender.com/ask` |

### Backend (`.env`)

| Variable | Descripción |
|:---|:---|
| `GROQ_API_KEY` | Tu API key de Groq Console |

---

## API

### `POST /ask`

Endpoint principal. Recibe una pregunta y retorna la respuesta en **streaming** (texto plano chunk por chunk).

**Request body:**

```json
{
  "name": "Sebastian",
  "question": "¿Qué es la inteligencia artificial?",
  "personality": "casual",
  "history": [
    { "t": "u", "x": "Hola" },
    { "t": "b", "x": "¡Hola Sebastian! ¿En qué puedo ayudarte?" }
  ]
}
```

| Campo | Tipo | Requerido | Descripción |
|:---|:---|:---|:---|
| `name` | `string` | Sí | Nombre del usuario. |
| `question` | `string` | Sí | Pregunta o mensaje del usuario. |
| `personality` | `string` | No | Modo de personalidad. Ver tabla abajo. |
| `history` | `array` | No | Historial previo de mensajes. |

**Personalidades disponibles:**

| Valor | Descripción |
|:---|:---|
| `casual` | Tono amigable y conversacional. |
| `tutor` | Explicaciones con método socrático y analogías. |
| `profesional` | Ejecutivo, formal, con datos concretos. |
| `tecnico` | Arquitectura de software, código limpio, markdown. |

**Respuesta:**

Stream de texto plano. Si se generó una imagen, se adjunta al final como markdown:

```markdown
![Imagen Generada](https://pollinations.ai/p/...)
```

### `GET /health`

Verifica el estado del servidor.

```json
{ "status": "ok" }
```

---

## Estructura del proyecto

```
zenith-gpt/
├── api/
│   ├── main.py              # FastAPI — endpoints /ask y /health
│   ├── groq_service.py      # Orquestador de agentes y lógica de IA
│   ├── schemas.py           # Modelos Pydantic para requests
│   └── personality.py       # Definición de personalidades
├── src/
│   ├── app/
│   │   ├── page.tsx         # Página principal — chat completo
│   │   ├── layout.tsx       # Layout raíz con metadata
│   │   ├── globals.css      # Estilos globales y tipografía
│   │   └── preview/
│   │       └── page.tsx     # Vista previa animada del orbe
│   └── components/
│       ├── AIOrb.tsx        # Orbe 3D con shaders, partículas y TTS
│       ├── ChatMessages.tsx  # Renderizado de mensajes con markdown
│       ├── InputBar.tsx     # Barra de entrada con selector de personalidad
│       ├── NewSidebars.tsx  # Sidebar de chats y navegación
│       ├── Suggestions.tsx  # Pantalla de bienvenida con prompts sugeridos
│       ├── WelcomeModal.tsx # Modal de registro de nombre
│       ├── InfoModal.tsx    # Modal de documentación del proyecto
│       ├── StatsModal.tsx   # Modal de estadísticas de uso
│       └── types.ts         # Tipos compartidos (Chat, Message)
├── public/
│   ├── favicon.png
│   ├── logo.png
│   └── preview.jpg
├── package.json
├── requirements.txt
├── tailwind.config.ts
├── tsconfig.json
└── LICENSE
```

---

## Personalización

### Cambiar el modelo de IA

En `api/groq_service.py` puedes modificar los modelos utilizados:

```python
MODEL_FAST = "llama-3.1-8b-instant"    # Respuestas rápidas
MODEL_POWER = "llama-3.3-70b-versatile"  # Tareas complejas
```

### Agregar una nueva personalidad

Edita el diccionario `personalidades` en `api/groq_service.py`:

```python
personalidades = {
    "casual": "...",
    "tutor": "...",
    "profesional": "...",
    "tecnico": "...",
    "mi_nueva_personalidad": "Eres Zenith, ...",
}
```

Y agrega el botón correspondiente en `src/components/InputBar.tsx`.

### Ajustar la temperatura

```python
TEMPERATURE = 0.8  # Rango: 0.0 (determinista) a 1.0 (creativo)
```

---

## Autor

**Sebastian Vasquez Echavarria**

- [Portafolio](https://sebas-dev.vercel.app/)
- [GitHub](https://github.com/sebastianvasquezechavarria1234)

---

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

```
MIT License — Copyright (c) 2026 Sebastian Vasquez Echavarria
```
