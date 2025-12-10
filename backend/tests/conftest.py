import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.exercise import MathProblem, StroopColor, WordList, ReadingText

# Используем SQLite для тестов (in-memory)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def test_engine():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def test_db(test_engine):
    TestSession = sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with TestSession() as session:
        yield session

@pytest_asyncio.fixture
async def seeded_db(test_db):
    """БД с тестовыми данными"""
    # Math problems
    for i in range(1, 11):
        for j in range(1, 11):
            test_db.add(MathProblem(expression=f"{i} + {j}", answer=i+j))

    # Stroop colors
    colors = [
        ("красный", "#FF0000"),
        ("синий", "#0000FF"),
        ("зелёный", "#008000"),
        ("жёлтый", "#FFD700"),
    ]
    for name, code in colors:
        test_db.add(StroopColor(color_name=name, color_code=code))

    # Word lists - need at least 12 words for memory tests
    test_db.add(WordList(
        category="test",
        words=["яблоко", "стол", "книга", "солнце", "река", "дом",
               "машина", "телефон", "дерево", "музыка", "окно", "небо"]
    ))

    # Reading text
    test_db.add(ReadingText(
        title="Тестовый текст",
        content="Это тестовый текст для чтения вслух. Он содержит несколько предложений.",
        word_count=10
    ))

    await test_db.commit()
    yield test_db

@pytest_asyncio.fixture
async def client(seeded_db):
    """HTTP клиент с тестовой БД"""
    async def override_get_db():
        yield seeded_db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
