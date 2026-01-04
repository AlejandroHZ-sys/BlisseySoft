import uvicorn
import sys
import os

# TRUCO: Agrega la ruta actual al sistema para que encuentre 'backend'
sys.path.append(os.getcwd())

if __name__ == "__main__":
    print("Iniciando BlisseySoft desde:", os.getcwd())
    # Ejecuta uvicorn directamente desde el código
    uvicorn.run("backend.core.main:app", host="127.0.0.1", port=8000, reload=True)
    