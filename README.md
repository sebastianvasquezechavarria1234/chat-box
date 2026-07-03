<div align="center">

  <img src="public/logo.png" alt="Zenith GPT" width="110" style="border-radius: 22px;" />

  # Zenith GPT

  *An AI chatbot that doesn't just answer — it feels present.*

  Powered by LLaMA 3.3, FastAPI, and a living interface built with Three.js.

  [![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6?style=flat-square)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)](https://nextjs.org)
  [![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=flat-square&logo=python)](https://fastapi.tiangolo.com)
  [![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Three.js%20%7C%20Tailwind-8B5CF6?style=flat-square)](#tech-stack)

  <br/>
  <br/>

  <img src="public/preview.jpg" alt="Zenith GPT Preview" width="100%" style="border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.15);" />

</div>

---

## What is this?

> *What if an AI could feel alive between messages?*

Zenith GPT is a chatbot, but not the kind you dismiss with a shrug. Every interaction has weight here. A 3D orb breathes in response to your mouse, to the cadence of speech, to the rhythm of thought. While the model thinks, the interface doesn't freeze — it *waits*, visibly, alive.

Under the hood, a multi-agent backend makes decisions in milliseconds: it detects your language, evaluates whether your question is ambiguous, and chooses the right tool — direct answer, web search, or image generation — before the first token reaches the screen.

---

## Features

| What it does | How |
|:---|:---|
| **Streaming responses** | Tokens arrive in real time via SSE. No loading spinners, no dead air. |
| **4 personalities** | Casual, Tutor, Professional, Technical — each with distinct tone and structure. |
| **Web search** | DuckDuckGo integration with source citation, triggered automatically when current data is needed. |
| **Image generation** | Requests are converted to cinematic prompts and rendered through Flux via Pollinations.ai. |
| **Language detection** | Responds in whichever language you write in — no settings to change. |
| **Ambiguity handling** | Asks for clarification before guessing when a question has multiple interpretations. |
| **Chat management** | Create, rename, search, favorite, and delete conversations. |
| **Usage stats** | Messages, characters sent/received, active days — tracked locally, never sent anywhere. |
| **Dark mode** | One toggle. Smooth transition. Zero flash on load. |
| **Keyboard shortcuts** | `Ctrl+N` new chat. `Ctrl+K` search. |
| **Responsive** | Full experience on mobile with a dedicated bottom nav and slide-out drawer. |

### The 3D orb

The orb isn't decoration. It's a metallic sphere with iridescence, clearcoat, and custom simplex noise shaders that distort the surface in response to three inputs:

- **Mouse proximity** — hovering accelerates orbiting particles and warps the geometry.
- **Audio frequency** — during TTS playback, sound waves drive real-time mesh deformation.
- **Time** — the sphere breathes on its own, subtly, between interactions.

Post-processing adds bloom, chromatic aberration, film noise, and vignette for a cinematic finish.

---

## Tech stack

### Frontend

| Library | Role |
|:---|:---|
| **Next.js 14** | App Router, server components, optimized bundling. |
| **React 18** | Declarative UI with hooks and concurrent features. |
| **TypeScript** | Full type safety across components and utilities. |
| **Tailwind CSS** | Utility-first styling with `class`-based dark mode. |
| **Three.js** | 3D rendering via React Three Fiber and Drei. |
| **Postprocessing** | Bloom, chromatic aberration, noise, and vignette effects. |
| **Framer Motion** | Spring animations, layout transitions, blur effects. |
| **react-markdown** | Markdown rendering with syntax highlighting for code blocks. |
| **Lucide React** | Consistent, lightweight icon system. |

### Backend

| Tool | Role |
|:---|:---|
| **FastAPI** | Async Python API with native streaming support. |
| **Groq** | Inference layer for LLaMA 3.3 70B and LLaMA 3.1 8B. |
| **DuckDuckGo Search** | Real-time web search with result parsing. |
| **Pollinations.ai** | Image generation through Flux model. |
| **Pydantic** | Request validation and schema enforcement. |

### Deployment

| Platform | What runs there |
|:---|:---|
| **Vercel** | Next.js frontend, edge-optimized, auto-deployed from Git. |
| **Render** | Python API with streaming, cold start on free tier. |

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Client (Vercel)                         │
│                                                           │
│   Next.js 14 ──► React 18 ──► Three.js Canvas            │
│        │              │              │                     │
│   Tailwind CSS   Framer Motion   R3F + PostFX            │
│                                                           │
│              Streaming POST ──────────────┐               │
└───────────────────────────────────────────┼───────────────┘
                                            │
                                            ▼
┌───────────────────────────────────────────────────────────┐
│                   API (Render)                             │
│                                                           │
│   FastAPI ──► Agent Orchestrator                          │
│                    │                                      │
│        ┌───────────┼───────────────┐                      │
│        ▼           ▼               ▼                      │
│   Groq API    DuckDuckGo     Pollinations.ai              │
│   (LLaMA)     (Search)      (Flux Images)                │
│                                                           │
│   Language ─► Ambiguity ─► Decision ─► Stream             │
└───────────────────────────────────────────────────────────┘
```

### How a conversation flows

1. You type a message. The frontend streams a `POST` to `/ask`.
2. The backend detects the **language** of your input.
3. It checks for **ambiguity** — if your question could mean multiple things, it asks before answering.
4. A routing decision is made: **direct answer**, **web search**, or **image generation**.
5. The appropriate model is selected — **LLaMA 3.3 70B** for complex queries, **LLaMA 3.1 8B** for fast ones.
6. Tokens stream back chunk by chunk. The 3D orb reacts in real time.
7. If an image was generated, it appears at the end of the response as markdown.

---

## Getting started

### Prerequisites

- Node.js >= 18.17.0
- Python 3.10+
- A [Groq API key](https://console.groq.com)

### Setup

**Clone and install the frontend:**

```bash
git clone https://github.com/sebastianvasquezechavarria1234/python-api-render.git
cd python-api-render
npm install
```

**Configure environment variables:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API URL:

```
NEXT_PUBLIC_API_URL=https://your-api-url/ask
```

**Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Set up the backend:**

```bash
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your Groq key:

```
GROQ_API_KEY=your_key_here
```

Start the API:

```bash
uvicorn api.main:app --reload --port 8000
```

> **Note:** The Render free tier puts the API to sleep after inactivity. The first request after idle takes 30–60 seconds to wake the server. Subsequent requests are instant.

---

## Environment variables

### Frontend (`.env.local`)

| Variable | Description |
|:---|:---|
| `NEXT_PUBLIC_API_URL` | Full URL to the backend `/ask` endpoint. |

### Backend (`.env`)

| Variable | Description |
|:---|:---|
| `GROQ_API_KEY` | Your Groq Console API key for LLaMA access. |

---

## API reference

### `POST /ask`

Streams a response as plain text, chunk by chunk.

**Request body:**

```json
{
  "name": "Sebastian",
  "question": "Explain quantum computing",
  "personality": "tecnico",
  "history": []
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | `string` | Yes | User's name, used in responses. |
| `question` | `string` | Yes | The message to process. |
| `personality` | `string` | No | One of: `casual`, `tutor`, `profesional`, `tecnico`. Defaults to `casual`. |
| `history` | `array` | No | Previous messages for context. Limited to last 5; older messages are summarized. |

**Response:** Streaming plain text. If an image was generated, it's appended as a markdown image tag pointing to Pollinations.ai.

### `GET /health`

Returns server status.

```json
{ "status": "ok" }
```

---

## Project structure

```
zenith-gpt/
├── api/
│   ├── main.py              # FastAPI app, CORS, /ask and /health endpoints
│   ├── groq_service.py      # Agent orchestrator, tool routing, model selection
│   ├── schemas.py           # Pydantic request models
│   └── personality.py       # Personality definitions
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main chat interface
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── globals.css      # Global styles, typography, scrollbar
│   └── components/
│       ├── AIOrb.tsx         # 3D orb with shaders, particles, TTS integration
│       ├── ChatMessages.tsx  # Message rendering with markdown and code blocks
│       ├── InputBar.tsx      # Input area with personality selector
│       ├── NewSidebars.tsx   # Desktop sidebar + mobile drawer
│       ├── Suggestions.tsx   # Empty-state cards with prompt suggestions
│       ├── WelcomeModal.tsx  # First-visit name entry
│       ├── InfoModal.tsx     # In-app documentation
│       ├── StatsModal.tsx    # Usage statistics dashboard
│       └── types.ts          # Chat and Message interfaces
├── public/
│   ├── favicon.png
│   ├── logo.png
│   └── preview.jpg
├── requirements.txt
├── tailwind.config.ts
├── vercel.json
└── LICENSE
```

---

## Customization

### Swap the AI model

In `api/groq_service.py`:

```python
MODEL_FAST = "llama-3.1-8b-instant"      # Fast responses
MODEL_POWER = "llama-3.3-70b-versatile"  # Complex reasoning
```

### Add a personality

Extend the `personalidades` dict in `api/groq_service.py`:

```python
personalidades = {
    "casual": "...",
    "tutor": "...",
    "profesional": "...",
    "tecnico": "...",
    "my_style": "You are Zenith, ...",
}
```

Then add a matching entry in `src/components/InputBar.tsx`.

### Adjust temperature

```python
TEMPERATURE = 0.8  # 0.0 = deterministic, 1.0 = creative
```

---





<div align="center">

Made with ❤️ by <a href="https://sebas-dev.vercel.app/" target="_blank" rel="noopener noreferrer">Sebastián V</a>

</div>