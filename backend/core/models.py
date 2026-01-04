from sqlalchemy import Column, Integer, String, Date, DateTime, Time, ForeignKey, LargeBinary, Numeric, Text
from sqlalchemy.orm import relationship
from backend.core.db import Base

# ==========================================
# 1. CATÁLOGOS Y ENTIDADES PRINCIPALES
# ==========================================

class Paciente(Base):
    __tablename__ = "paciente"

    idPaciente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fechaNacimiento = Column(Date)
    sexo = Column(String(20))
    direccion = Column(String(200))
    telefono = Column(String(20))
    contactoResponsable = Column(String(100))
    historialClinico = Column(LargeBinary, nullable=True) # Mapeo de BYTEA

    # Relaciones (Para acceder a los datos relacionados fácilmente)
    camas = relationship("Cama", back_populates="paciente")
    registros_enfermeria = relationship("RegistroEnfermeria", back_populates="paciente")
    suministros = relationship("SuministroMedicamento", back_populates="paciente")
    registros_insumo = relationship("RegistroInsumo", back_populates="paciente")


class Enfermero(Base):
    __tablename__ = "enfermero"

    idEnfermero = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    cedulaProfesional = Column(LargeBinary, nullable=True)
    tipo = Column(String(50))
    estado = Column(String(50))

    # Relaciones
    registros_creados = relationship("RegistroEnfermeria", back_populates="enfermero")
    suministros_dados = relationship("SuministroMedicamento", back_populates="enfermero")
    asignaciones = relationship("Asignacion", back_populates="enfermero")
    registros_insumo = relationship("RegistroInsumo", back_populates="enfermero")
    participaciones = relationship("ParticipacionCapacitacion", back_populates="enfermero")
    evaluaciones = relationship("EvaluacionDesempeno", back_populates="enfermero")


class Medicamento(Base):
    __tablename__ = "medicamento"

    idMedicamento = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    presentacion = Column(String(100))
    dosisRecomendada = Column(String(100))

    # Relaciones
    suministros = relationship("SuministroMedicamento", back_populates="medicamento")


class Insumo(Base):
    __tablename__ = "insumo"

    idInsumo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    cantidadDisponible = Column(Integer)

    # Relaciones
    registros_uso = relationship("RegistroInsumo", back_populates="insumo")


class Turno(Base):
    __tablename__ = "turno"

    idTurno = Column(Integer, primary_key=True, index=True)
    tipoTurno = Column(String(50))
    horaInicio = Column(Time)
    horaFin = Column(Time)
    fecha = Column(Date)

    # Relaciones
    asignaciones = relationship("Asignacion", back_populates="turno")


# ==========================================
# 2. INFRAESTRUCTURA HOSPITALARIA
# ==========================================

class AreaHospital(Base):
    __tablename__ = "areahospital"

    idArea = Column(Integer, primary_key=True, index=True)
    nombreArea = Column(String(100))
    piso = Column(Integer)
    especialidad = Column(String(100))

    # Relaciones
    habitaciones = relationship("Habitacion", back_populates="area")
    asignaciones = relationship("Asignacion", back_populates="area")


class Habitacion(Base):
    __tablename__ = "habitacion"

    idHabitacion = Column(Integer, primary_key=True, index=True)
    numeroHabitacion = Column(Integer)
    piso = Column(Integer)
    
    # ForeignKey
    idArea = Column(Integer, ForeignKey("areahospital.idArea"))

    # Relaciones
    area = relationship("AreaHospital", back_populates="habitaciones")
    camas = relationship("Cama", back_populates="habitacion")


class Cama(Base):
    __tablename__ = "cama"

    idCama = Column(Integer, primary_key=True, index=True)
    numeroCama = Column(Integer)
    
    # ForeignKeys
    idHabitacion = Column(Integer, ForeignKey("habitacion.idHabitacion"))
    idPaciente = Column(Integer, ForeignKey("paciente.idPaciente"), nullable=True) # Puede estar vacía

    # Relaciones
    habitacion = relationship("Habitacion", back_populates="camas")
    paciente = relationship("Paciente", back_populates="camas")


# ==========================================
# 3. REGISTROS Y OPERACIONES
# ==========================================

class RegistroEnfermeria(Base):
    __tablename__ = "registroenfermeria"

    idRegistro = Column(Integer, primary_key=True, index=True)
    fechaHora = Column(DateTime)
    presionArterial = Column(String(50))
    glucosa = Column(String(50))
    oxigeno = Column(String(50))
    temperatura = Column(Numeric(4, 2)) # DECIMAL(4,2)
    evacuaciones = Column(Integer)
    orinaMI = Column(String(50))
    observaciones = Column(Text)

    # ForeignKeys
    idPaciente = Column(Integer, ForeignKey("paciente.idPaciente"))
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))

    # Relaciones
    paciente = relationship("Paciente", back_populates="registros_enfermeria")
    enfermero = relationship("Enfermero", back_populates="registros_creados")


class SuministroMedicamento(Base):
    __tablename__ = "suministromedicamento"

    idSuministro = Column(Integer, primary_key=True, index=True)
    fechaHora = Column(DateTime)
    dosis = Column(String(100))

    # ForeignKeys
    idPaciente = Column(Integer, ForeignKey("paciente.idPaciente"))
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))
    idMedicamento = Column(Integer, ForeignKey("medicamento.idMedicamento"))

    # Relaciones
    paciente = relationship("Paciente", back_populates="suministros")
    enfermero = relationship("Enfermero", back_populates="suministros_dados")
    medicamento = relationship("Medicamento", back_populates="suministros")


class RegistroInsumo(Base):
    __tablename__ = "registroinsumo"

    idRegistroInsumo = Column(Integer, primary_key=True, index=True)
    fechaHora = Column(DateTime)
    cantidadUsada = Column(Integer)

    # ForeignKeys
    idPaciente = Column(Integer, ForeignKey("paciente.idPaciente"))
    idInsumo = Column(Integer, ForeignKey("insumo.idInsumo"))
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))

    # Relaciones
    paciente = relationship("Paciente", back_populates="registros_insumo")
    insumo = relationship("Insumo", back_populates="registros_uso")
    enfermero = relationship("Enfermero", back_populates="registros_insumo")


class Asignacion(Base):
    __tablename__ = "asignacion"

    idAsignacion = Column(Integer, primary_key=True, index=True)
    fijo = Column(String(100))

    # ForeignKeys
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))
    idArea = Column(Integer, ForeignKey("areahospital.idArea"))
    idTurno = Column(Integer, ForeignKey("turno.idTurno"))

    # Relaciones
    enfermero = relationship("Enfermero", back_populates="asignaciones")
    area = relationship("AreaHospital", back_populates="asignaciones")
    turno = relationship("Turno", back_populates="asignaciones")


# ==========================================
# 4. CAPACITACIÓN Y RH
# ==========================================

class Capacitacion(Base):
    __tablename__ = "capacitacion"

    idCapacitacion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    tipo = Column(String(50))
    fecha = Column(Date)
    responsable = Column(String(100))

    # Relaciones
    participaciones = relationship("ParticipacionCapacitacion", back_populates="capacitacion")


class ParticipacionCapacitacion(Base):
    __tablename__ = "participacioncapacitacion"

    idParticipacion = Column(Integer, primary_key=True, index=True)
    estado = Column(String(50))

    # ForeignKeys
    idCapacitacion = Column(Integer, ForeignKey("capacitacion.idCapacitacion"))
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))

    # Relaciones
    capacitacion = relationship("Capacitacion", back_populates="participaciones")
    enfermero = relationship("Enfermero", back_populates="participaciones")


class EvaluacionDesempeno(Base):
    __tablename__ = "evaluaciondesempeno"

    idEvaluacion = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date)
    puntaje = Column(Numeric(5, 2))
    observaciones = Column(Text)

    # ForeignKeys
    idEnfermero = Column(Integer, ForeignKey("enfermero.idEnfermero"))

    # Relaciones
    enfermero = relationship("Enfermero", back_populates="evaluaciones")
    