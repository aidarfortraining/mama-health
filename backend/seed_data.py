import asyncio
from app.database import AsyncSessionLocal, engine, Base
from app.models.exercise import MathProblem, ReadingText, WordList, StroopColor, ExerciseType

STROOP_COLORS = [
    ("красный", "#FF0000"),
    ("синий", "#0000FF"),
    ("зелёный", "#008000"),
    ("жёлтый", "#FFD700"),
    ("оранжевый", "#FFA500"),
    ("фиолетовый", "#800080"),
]

EXERCISE_TYPES = [
    ("counting", "Счёт вслух", 120, "Считайте вслух от 1 до 120 как можно быстрее"),
    ("arithmetic", "Арифметика", 120, "Решите 100 простых примеров на скорость"),
    ("reading", "Чтение вслух", 180, "Прочитайте текст вслух чётко и внятно"),
    ("stroop", "Тест Струпа", 120, "Назовите ЦВЕТ букв, игнорируя само слово"),
    ("memory", "Запоминание слов", 180, "Запомните слова, затем воспроизведите их"),
]

WORD_CATEGORIES = {
    "животные": ["кошка", "собака", "лошадь", "корова", "птица", "рыба", "медведь", "волк", "лиса", "заяц", "мышь", "слон"],
    "еда": ["хлеб", "молоко", "яблоко", "суп", "каша", "мясо", "рыба", "сыр", "масло", "яйцо", "картофель", "морковь"],
    "дом": ["стол", "стул", "кровать", "шкаф", "окно", "дверь", "лампа", "диван", "зеркало", "ковёр", "полка", "часы"],
    "природа": ["дерево", "цветок", "река", "гора", "солнце", "луна", "облако", "дождь", "снег", "ветер", "трава", "лес"],
}

READING_TEXTS = [
    ("Утро в деревне", """Раннее утро в деревне начинается с пения петухов. Солнце медленно поднимается над горизонтом, окрашивая небо в розовые и золотые тона. Роса блестит на траве, как маленькие бриллианты. Деревенские жители уже проснулись и начинают свои дела. Бабушка выходит покормить кур, дедушка идёт в огород. Воздух свежий и чистый, пахнет цветами и скошенной травой. Птицы поют свои весёлые песни, приветствуя новый день."""),
    ("Зимний лес", """Зимний лес стоит тихий и задумчивый. Деревья укрыты белым снегом, словно надели пушистые шубы. Под ногами хрустит снег. Следы зайца ведут в чащу леса. На ветке сидит красногрудый снегирь. Мороз щиплет щёки, но в лесу хорошо и спокойно. Солнечные лучи пробиваются сквозь ветви и рисуют на снегу причудливые узоры. Лёгкий ветерок качает верхушки елей."""),
    ("Весенний сад", """Весна пришла в наш сад. Яблони и вишни покрылись белыми и розовыми цветами. Пчёлы жужжат, собирая нектар. В воздухе разлит сладкий аромат цветущих деревьев. Птицы вернулись из тёплых краёв и строят гнёзда. Трава зеленеет с каждым днём. На клумбах распустились первые тюльпаны и нарциссы. Всё вокруг радуется теплу и солнцу."""),
]

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Exercise types
        for name, desc, duration, instructions in EXERCISE_TYPES:
            et = ExerciseType(name=name, description=desc, duration_seconds=duration, instructions=instructions)
            db.add(et)

        # Stroop colors
        for name, code in STROOP_COLORS:
            db.add(StroopColor(color_name=name, color_code=code))

        # Math problems
        for a in range(1, 21):
            for b in range(1, 21):
                db.add(MathProblem(expression=f"{a} + {b}", answer=a+b, difficulty=1))
                if a >= b:
                    db.add(MathProblem(expression=f"{a} - {b}", answer=a-b, difficulty=1))

        for a in range(2, 11):
            for b in range(2, 11):
                db.add(MathProblem(expression=f"{a} × {b}", answer=a*b, difficulty=2))

        # Word lists
        for category, words in WORD_CATEGORIES.items():
            db.add(WordList(category=category, words=words, difficulty=1))

        # Reading texts
        for title, content in READING_TEXTS:
            word_count = len(content.split())
            db.add(ReadingText(title=title, content=content, word_count=word_count, difficulty=1))

        await db.commit()
        print("✅ Seed data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
