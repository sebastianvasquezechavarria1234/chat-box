<div align="center">

  <img src="public/logo.png" alt="Zenith GPT Logo" width="120" style="border-radius: 24px;" />

  # Zenith GPT

  **An intelligent AI-powered chatbot.**

  Powered by LLaMA 3.3, FastAPI, and an interface that breathes.

  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6?style=flat-square)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)](https://nextjs.org)
  [![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=flat-square&logo=python)](https://fastapi.tiangolo.com)
  [![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%20•%20React%20•%20Three.js%20•%20Tailwind-8B5CF6?style=flat-square)](#tech-stack)

  <br/>

  <img src="public/preview.jpg" alt="Zenith GPT Preview" width="100%" style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);" />

  ---
</div>

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API](#api)
- [Project structure](#project-structure)
- [Customization](#customization)
- [Author](#author)
- [License](#license)

---

## Overview

> *Zenith GPT was born from a simple question: what if an AI could feel alive?*

It is more than a chatbot. It is a visual and conversational experience where every interaction carries weight. A 3D orb reacts to the mouse, to the rhythm of the voice, to the context of the conversation. While the AI thinks, the interface also breathes.

The backend operates as a **multi-agent system**: it detects the user's language, analyzes whether the question is ambiguous, decides whether to search the web or generate an image, and automatically selects the most suitable model. All of this happens in milliseconds, before the first word reaches the screen.

---

## Features

| Capability | Details |
|:---|:---|
| **Real-time streaming** | Responses appear character by character, no waiting. |
| **4 personalities** | Casual, Tutor, Professional, and Technical — each with its own tone and structure. |
| **Integrated web search** | When a question requires current data, Zenith searches DuckDuckGo and cites sources. |
| **Image generation** | Ask for an image and Zenith creates it with Flux through Pollinations.ai. |
| **Language detection** | Responds in Spanish, English, Portuguese, or any detected language automatically. |
| **Automatic clarification** | If a question is ambiguous, it asks for context before answering. |
| **Conversation management** | Create, rename, search, favorite, and delete chats. |
| **Usage statistics** | Messages, characters, active days — all stored locally. |
| **Light and dark theme** | A single toggle, smooth transition, zero flashes. |
| **Keyboard shortcuts** | `Ctrl+N` for new chat, `Ctrl+K` to search. |

### The 3D Orb

The orb is not decoration. It is a metallic sphere with *iridescence*, *clearcoat*, and custom simplex noise shaders that react to three stimuli:

- **The mouse** — when hovering, the sphere distorts and the orbiting particles accelerate.
- **The audio** — when the AI speaks (TTS), the sound frequency modifies the geometry in real time.
- **Time** — the sphere breathes organically, as if it had its own pulse.

---

## Tech stack

### Frontend

| Technology | Purpose |
|:---|:---|
| **Next.js 14** | React framework with App Router and server components. |
| **React 18** | Declarative UI with hooks and server-side rendering. |
| **TypeScript** | Type safety across the entire project. |
| **Tailwind CSS** | Utility-first styles with class-based dark mode. |
| **Three.js** | 3D rendering of the orb with React Three Fiber. |
| **Framer Motion** | Declarative animations: blur, spring, layout animations. |
| **react-markdown** | Markdown rendering with syntax highlighting. |
| **Lucide React** | Clean and consistent iconography. |

### Backend

| Technology | Purpose |
|:---|:---|
| **Python** | Backend language. |
| **FastAPI** | Async API with native streaming. |
| **Groq API** | Access to LLaMA 3.3 70B and LLaMA 3.1 8B. |
| **DuckDuckGo Search** | Real-time web search. |
| **Pollinations.ai** | Image generation with Flux. |
| **Pydantic** | Request schema validation. |

### Deployment

| Service | Role |
|:---|:---|
| **Vercel** | Frontend — automatic deploy from GitHub. |
| **Render** | Backend — API with streaming and cold start on free plan. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Vercel)                      │
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
│   FastAPI  ──►  Agent Orchestrator                      │
│                    │                                    │
│        ┌───────────┼───────────────┐                    │
│        ▼           ▼               ▼                    │
│   Groq API    DuckDuckGo     Pollinations.ai            │
│   (LLaMA)     (Search)      (Flux Images)              │
│                                                         │
│   Language ─► Ambiguity ─► Decision ─► Stream           │
└─────────────────────────────────────────────────────────┘
```

### Conversation flow

1. The user types a question in the chat.
2. The frontend sends a streaming `POST` to the `/ask` endpoint.
3. The backend **detects the language** of the question.
4. It analyzes whether the question is **ambiguous** and decides whether to ask for clarification.
5. It evaluates whether it requires **web search**, **image generation**, or a **direct answer**.
6. It selects the appropriate model: **LLaMA 3.3 70B** for complex tasks, **LLaMA 3.1 8B** for quick ones.
7. The response is streamed **chunk by chunk** back to the frontend.
8. The 3D orb reacts visually to the content being generated.

---

## Getting started

### Requirements

- Node.js >= 18.17.0
- Python 3.10+
- An API key from [Groq](https://console.groq.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/sebastianvasquezechavarria1234/python-api-render.git
cd python-api-render
```

**2. Frontend**

```bash
npm install
cp .env.local.example .env.local   # configure variables
npm run dev
```

The development server will be available at `http://localhost:3000`.

**3. Backend**

```bash
pip install -r requirements.txt
cp .env.example .env               # configure variables
uvicorn api.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

> **Note:** The API deployed on Render enters sleep mode after inactivity. The first request may take 30–60 seconds while the server reactivates.

---

## Environment variables

### Frontend (`.env.local`)

| Variable | Description | Example |
|:---|:---|:---|
| `NEXT_PUBLIC_API_URL` | URL of the backend `/ask` endpoint | `https://python-api-render-ubr9.onrender.com/ask` |

### Backend (`.env`)

| Variable | Description |
|:---|:---|
| `GROQ_API_KEY` | Your Groq Console API key |

---

## API

### `POST /ask`

Main endpoint. Receives a question and returns the response as a **stream** (plain text chunk by chunk).

**Request body:**

```json
{
  "name": "Sebastian",
  "question": "What is artificial intelligence?",
  "personality": "casual",
  "history": [
    { "t": "u", "x": "Hello" },
    { "t": "b", "x": "Hey Sebastian! How can I help you?" }
  ]
}
```

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `name` | `string` | Yes | User's name. |
| `question` | `string` | Yes | User's question or message. |
| `personality` | `string` | No | Personality mode. See table below. |
| `history` | `array` | No | Previous message history. |

**Available personalities:**

| Value | Description |
|:---|:---|
| `casual` | Friendly and conversational tone. |
| `tutor` | Explanations using the Socratic method and analogies. |
| `profesional` | Executive, formal, with concrete data. |
| `tecnico` | Software architecture, clean code, markdown. |

**Response:**

Plain text stream. If an image was generated, it is attached at the end as markdown:

```markdown
![Generated Image](https://pollinations.ai/p/...)
```

### `GET /health`

Checks the server status.

```json
{ "status": "ok" }
```

---

## Project structure

```
zenith-gpt/
├── api/
│   ├── main.py              # FastAPI — /ask and /health endpoints
│   ├── groq_service.py      # Agent orchestrator and AI logic
│   ├── schemas.py           # Pydantic models for requests
│   └── personality.py       # Personality definitions
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main page — full chat
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── globals.css      # Global styles and typography
│   │   └── preview/
│   │       └── page.tsx     # Animated orb preview page
│   └── components/
│       ├── AIOrb.tsx        # 3D orb with shaders, particles, and TTS
│       ├── ChatMessages.tsx  # Message rendering with markdown
│       ├── InputBar.tsx     # Input bar with personality selector
│       ├── NewSidebars.tsx  # Chat sidebar and navigation
│       ├── Suggestions.tsx  # Welcome screen with suggested prompts
│       ├── WelcomeModal.tsx # Name registration modal
│       ├── InfoModal.tsx    # Project documentation modal
│       ├── StatsModal.tsx   # Usage statistics modal
│       └── types.ts         # Shared types (Chat, Message)
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

## Customization

### Change the AI model

In `api/groq_service.py` you can modify the models used:

```python
MODEL_FAST = "llama-3.1-8b-instant"      # Quick responses
MODEL_POWER = "llama-3.3-70b-versatile"  # Complex tasks
```

### Add a new personality

Edit the `personalidades` dictionary in `api/groq_service.py`:

```python
personalidades = {
    "casual": "...",
    "tutor": "...",
    "profesional": "...",
    "tecnico": "...",
    "my_new_personality": "You are Zenith, ...",
}
```

And add the corresponding button in `src/components/InputBar.tsx`.

### Adjust the temperature

```python
TEMPERATURE = 0.8  # Range: 0.0 (deterministic) to 1.0 (creative)
```

---

## Author

<div align="center">

*Sebastian Vasquez Echavarria*

[Portfolio](https://sebas-dev.vercel.app/) · [GitHub](https://github.com/sebastianvasquezechavarria1234)

</div>

---

## License

<div align="center">

This project is under the [MIT](LICENSE) license.

```
MIT License — Copyright (c) 2026 Sebastian Vasquez Echavarria
```

Made with ❤️ by Sebastian V

</div>
