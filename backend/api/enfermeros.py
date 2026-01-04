from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.core.db import get_db
from backend.core.models import Enfermero
from backend.schemas import EnfermeroCreate, EnfermeroResponse

router = APIRouter()

# --- ENDPOINT 1: CREAR ENFERMERO (POST) ---
@router.post("/", response_model=EnfermeroResponse)
def crear_enfermero(enfermero: EnfermeroCreate, db: Session = Depends(get_db)):
    # 1. Crear la instancia del modelo con los datos del schema
    nuevo_enfermero = Enfermero(
        nombre=enfermero.nombre,
        apellido=enfermero.apellido,
        tipo=enfermero.tipo,
        estado=enfermero.estado
        # Nota: Dejamos la cédula null por ahora para probar rápido
    )
    
    # 2. Guardar en DB
    db.add(nuevo_enfermero)
    db.commit()
    db.refresh(nuevo_enfermero) # Recarga el ID generado automáticamente
    
    return nuevo_enfermero

# --- ENDPOINT 2: LISTAR ENFERMEROS (GET) ---
@router.get("/", response_model=List[EnfermeroResponse])
def leer_enfermeros(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    enfermeros = db.query(Enfermero).offset(skip).limit(limit).all()
    return enfermeros
