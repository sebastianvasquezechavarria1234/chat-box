from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import QuestionRequest
from backend.groq_service import ask_groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="API con Groq IA", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    print(f"Pregunta recibida de {data.name}: {data.question}")
    answer = ask_groq(data.name, data.question)
    print(f"Respuesta generada para {data.name}")
    return {"answer": answer}
