class Question(BaseModel):
    name: str
    question: str
    personality: str = "casual"  # valor por defecto
