from pydantic import BaseModel
from typing import Optional

# 1. Base: Lo que es común (para leer y crear)
class EnfermeroBase(BaseModel):
    nombre: str
    apellido: str
    tipo: str    # Ej: "General", "Jefe de Piso"
    estado: str  # Ej: "Activo", "Vacaciones"

# 2. Create: Lo que necesitas para CREAR (Input)
class EnfermeroCreate(EnfermeroBase):
    pass 
    # Aquí podrías agregar campos extra si fueran necesarios, 
    # pero por ahora son los mismos que la base.

# 3. Response: Lo que devolvemos al usuario (Output)
class EnfermeroResponse(EnfermeroBase):
    idEnfermero: int
    # No devolvemos la cédula (bytes) por ahora para no hacer ruido visual

    class Config:
        # Esto es vital: le dice a Pydantic que lea datos de un modelo ORM
        from_attributes = True
        