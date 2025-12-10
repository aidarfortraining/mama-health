from sqlalchemy import Column, Integer, String, Text, JSON
from app.database import Base

class ExerciseType(Base):
    __tablename__ = "exercise_types"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text)
    duration_seconds = Column(Integer, default=120)
    instructions = Column(Text)

class MathProblem(Base):
    __tablename__ = "math_problems"

    id = Column(Integer, primary_key=True)
    expression = Column(String(20), nullable=False)
    answer = Column(Integer, nullable=False)
    difficulty = Column(Integer, default=1)

class ReadingText(Base):
    __tablename__ = "reading_texts"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    content = Column(Text, nullable=False)
    word_count = Column(Integer)
    source = Column(String(200))
    difficulty = Column(Integer, default=1)

class WordList(Base):
    __tablename__ = "word_lists"

    id = Column(Integer, primary_key=True)
    category = Column(String(50))
    words = Column(JSON, nullable=False)  # Changed from ARRAY to JSON for SQLite compatibility
    difficulty = Column(Integer, default=1)

class StroopColor(Base):
    __tablename__ = "stroop_colors"

    id = Column(Integer, primary_key=True)
    color_name = Column(String(20), nullable=False)
    color_code = Column(String(7), nullable=False)
