from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.schemas import QuestionRequest
from api.groq_service import ask_groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="API con Groq IA", version="1.0.0")

# Configuración de CORS permitiendo todos los orígenes para evitar bloqueos en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return {"error": "Ocurrió un error inesperado en el servidor", "details": str(exc)}


@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi.responses import StreamingResponse

@app.post("/ask")
async def ask(data: QuestionRequest):
    print(f"Pregunta recibida de {data.name}: {data.question} (Modo: {data.personality})")
    try:
        # Devolvemos un StreamingResponse para que el cliente reciba los datos poco a poco
        return StreamingResponse(
            ask_groq(data.name, data.question, data.personality), 
            media_type="text/plain"
        )
    except Exception as e:
        print(f"Error al iniciar streaming: {e}")
        return {"error": "Error al procesar la respuesta de la IA", "details": str(e)}
