from pydantic import BaseModel
from typing import List, Optional

class MathProblemOut(BaseModel):
    id: int
    expression: str
    answer: int

class ArithmeticResponse(BaseModel):
    problems: List[MathProblemOut]
    time_limit_seconds: int = 120

class ReadingTextOut(BaseModel):
    id: int
    title: Optional[str]
    content: str
    word_count: Optional[int]

class StroopItem(BaseModel):
    id: int
    word: str
    display_color: str
    correct_answer: str

class StroopResponse(BaseModel):
    items: List[StroopItem]
    time_limit_seconds: int = 120

class MemoryWordsResponse(BaseModel):
    words: List[str]
    memorize_time_seconds: int = 60
    recall_time_seconds: int = 120

class ExerciseResultCreate(BaseModel):
    session_id: Optional[int] = None
    exercise_type: str
    score: int
    time_seconds: float
    correct_answers: int
    total_questions: int
    details: Optional[dict] = None

class ExerciseResultOut(BaseModel):
    id: int
    exercise_type: str
    score: int
    time_seconds: float
    correct_answers: int
    total_questions: int

class SessionCreate(BaseModel):
    pass

class SessionOut(BaseModel):
    id: int
    total_score: int
    results: List[ExerciseResultOut] = []
