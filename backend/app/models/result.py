from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id = Column(Integer, primary_key=True)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    total_score = Column(Integer, default=0)

    results = relationship("ExerciseResult", back_populates="session")

class ExerciseResult(Base):
    __tablename__ = "exercise_results"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("training_sessions.id"))
    exercise_type = Column(String(50), nullable=False)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime)
    score = Column(Integer)
    time_seconds = Column(Float)  # Changed from DECIMAL for SQLite compatibility
    correct_answers = Column(Integer)
    total_questions = Column(Integer)
    details = Column(JSON)  # Changed from JSONB for SQLite compatibility

    session = relationship("TrainingSession", back_populates="results")
