from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# 1. Crear el motor de la base de datos
engine = create_engine(settings.DATABASE_URL)

# 2. Crear la clase SessionLocal
# Cada instancia de esta clase será una sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Crear la clase Base
# De esta clase heredarán todos tus modelos (tablas) de Python
Base = declarative_base()

# 4. Dependencia para obtener la DB (para usar en dependencies.py)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        