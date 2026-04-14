# 🤖 Chat IA — LLaMA 3.3 Power

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
</p>

---

## 🌟 ¿Qué es este proyecto?

Este es un **chatbot inteligente** diseñado para ofrecer una experiencia de usuario premium, actuando como intermediario entre una interfaz moderna y el modelo de lenguaje **LLaMA 3.3 70B** a través de **Groq**.

La aplicación está construida con una arquitectura desacoplada, asegurando velocidad y seguridad en cada interacción. 

---

## ✨ Características Principales

- 🎭 **Personalidades Dinámicas:** Interactúa con perfiles como Casual, Tutor, Profesional o Técnico.
- ⚡ **Alta Velocidad:** Inferencia de IA optimizada gracias a la infraestructura de Groq.
- 📜 **Historial Local:** Tus conversaciones se guardan en el navegador para que nunca pierdas el hilo.
- ✍️ **Typewriter Effect:** Una experiencia de lectura fluida y natural en las respuestas.
- 📱 **Diseño Responsivo:** Optimizado para dispositivos móviles y escritorio.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Backend** | Python, FastAPI, Uvicorn |
| **Frontend** | HTML5, Tailwind CSS, JavaScript (Vanilla) |
| **IA Engine** | Groq (LLaMA 3.3 70B) |
| **Deployment** | Render (API), Vercel (Frontend) |
| **Persistencia** | LocalStorage |

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para tener el chatbot corriendo en tu máquina:

### 1. Clonar y Preparar
```bash
git clone https://github.com/sebastianvasquezechavarria1234/python-api-render.git
cd python-api-render
```

### 2. Entorno Virtual
```bash
# Crear entorno
python -m venv venv

# Activar en Windows
venv\Scripts\activate

# Activar en Linux/Mac
source venv/bin/activate
```

### 3. Dependencias y Configuración
```bash
pip install -r requirements.txt
```

Crea un archivo `.env` en la raíz con tu API Key:
```env
GROQ_API_KEY=tu_clave_aqui
```

### 4. Lanzar la API
```bash
uvicorn app.main:app --reload
```
La API estará disponible en `http://127.0.0.1:8000`. ¡Solo abre el `index.html` y empieza a chatear!

---

## 📡 Documentación de la API

### Endpoint: `POST /ask`
Envía una pregunta para recibir una respuesta inteligente.

**Ejemplo de Body (JSON):**
```json
{
  "name": "Sebastian",
  "question": "¿Qué es la inteligencia artificial?",
  "personality": "casual"
}
```

**Personalidades soportadas:** `casual`, `tutor`, `profesional`, `tecnico`.

---

## 📁 Estructura del Proyecto

```text
├── app/                  # Núcleo de la API (Python)
│   ├── main.py           # Rutas y configuración de FastAPI
│   ├── groq_service.py   # Lógica de conexión con Groq
│   ├── schemas.py        # Modelos de datos (Pydantic)
│   └── personality.py    # Definiciones de System Prompts
├── index.html            # Interfaz de usuario
├── script.js             # Lógica del cliente
├── style.css             # Estilos personalizados
└── vercel.json           # Configuración de despliegue
```

---

## 👤 Autor

Desarrollado con ❤️ por **Sebastian Vasquez Echavarria**.

- 🌐 [Mi Portafolio](https://sebas-dev.vercel.app)
- 🐙 [Mi GitHub](https://github.com/sebastianvasquezechavarria1234)

---

<p align="center">
  <i>"IA democratizada a través de un código limpio y eficiente."</i>
</p>