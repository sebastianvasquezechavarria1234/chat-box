from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class QuestionRequest(BaseModel):
    name: str = Field(..., description="Nombre del usuario")
    question: str = Field(..., description="Pregunta para la IA")
    personality: str = Field("casual", description="Personalidad del chatbot")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Historial de mensajes previos")
