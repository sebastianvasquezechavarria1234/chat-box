from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import QuestionRequest
from app.groq_service import ask_groq
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

@app.post("/ask")
def ask(data: QuestionRequest):
    print(f"Pregunta recibida de {data.name}: {data.question} (Modo: {data.personality})")
    try:
        answer = ask_groq(data.name, data.question, data.personality)
        print(f"Respuesta generada para {data.name}")
        return {"answer": answer}
    except Exception as e:
        print(f"Error al llamar a Groq: {e}")
        return {"error": "Error al procesar la respuesta de la IA", "details": str(e)}
