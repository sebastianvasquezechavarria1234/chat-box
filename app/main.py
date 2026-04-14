from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import QuestionRequest
from app.groq_service import ask_groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="API con Groq IA", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask")
def ask(data: QuestionRequest):
    print(f"Pregunta recibida de {data.name}: {data.question}")
    answer = ask_groq(data.name, data.question)
    return {"answer": answer}
