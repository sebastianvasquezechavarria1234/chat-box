from pydantic import BaseModel, Field

class QuestionRequest(BaseModel):
    name: str = Field(..., description="Nombre del usuario")
    question: str = Field(..., description="Pregunta para la IA")
    personality: str = Field("casual", description="Personalidad del chatbot")
