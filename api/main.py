from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from api.schemas import QuestionRequest
from api.groq_service import ask_groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Genesis AI API", version="1.0.0")

# Configuración de CORS permitiendo todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask")
async def ask(data: QuestionRequest):
    print(f"Pregunta recibida de {data.name}: {data.question} (Modo: {data.personality})")
    try:
        return StreamingResponse(
            ask_groq(data.name, data.question, data.personality), 
            media_type="text/plain"
        )
    except Exception as e:
        print(f"Error en streaming: {e}")
        return {"error": str(e)}
