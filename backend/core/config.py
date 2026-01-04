# backend/core/config.py
class Settings:
    PROJECT_NAME: str = "BlisseySoft"
    PROJECT_VERSION: str = "1.0.0"

    # Escribimos los datos DIRECTO (Hardcoding) para descartar errores de lectura
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "1234"
    POSTGRES_SERVER: str = "127.0.0.1"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "BlisseySoft"

    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

settings = Settings()