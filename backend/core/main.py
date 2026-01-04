from fastapi import FastAPI
from backend.core.db import engine, Base
import backend.core.models 

# IMPORTS NUEVOS
from backend.api.enfermeros import router as enfermeros_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlisseySoft API")

# Incluir el router de enfermeros
# prefix="/enfermeros" significa que las rutas serán: /enfermeros/
# tags=["Enfermeros"] sirve para agruparlos bonito en la documentación
app.include_router(enfermeros_router, prefix="/enfermeros", tags=["Enfermeros"])

@app.get("/")
def read_root():
    return {"msg": "Conexión exitosa a BlisseySoft"}
