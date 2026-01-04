CREATE DATABASE BlisseySoft;
\c BlisseySoft;

CREATE TABLE Paciente (
    idPaciente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fechaNacimiento DATE,
    sexo VARCHAR(20),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    contactoResponsable VARCHAR(100),
    historialClinico BYTEA
);

CREATE TABLE Enfermero (
    idEnfermero INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedulaProfesional BYTEA,
    tipo VARCHAR(50),
    estado VARCHAR(50)
);

CREATE TABLE AreaHospital (
    idArea INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombreArea VARCHAR(100),
    piso INT,
    especialidad VARCHAR(100)
);

CREATE TABLE Habitacion (
    idHabitacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numeroHabitacion INT,
    piso INT,
    idArea INT,
    FOREIGN KEY (idArea) REFERENCES AreaHospital(idArea)
);

CREATE TABLE Cama (
    idCama INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numeroCama INT,
    idHabitacion INT,
    idPaciente INT,
    FOREIGN KEY (idHabitacion) REFERENCES Habitacion(idHabitacion),
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

CREATE TABLE Medicamento (
    idMedicamento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    presentacion VARCHAR(100),
    dosisRecomendada VARCHAR(100)
);

CREATE TABLE RegistroEnfermeria (
    idRegistro INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaHora TIMESTAMP,
    presionArterial VARCHAR(50),
    glucosa VARCHAR(50),
    oxigeno VARCHAR(50),
    temperatura DECIMAL(4,2),
    evacuaciones INT,
    orinaMI VARCHAR(50),
    observaciones TEXT,
    idPaciente INT,
    idEnfermero INT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero)
);

CREATE TABLE SuministroMedicamento (
    idSuministro INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaHora TIMESTAMP,
    dosis VARCHAR(100),
    idPaciente INT,
    idEnfermero INT,
    idMedicamento INT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero),
    FOREIGN KEY (idMedicamento) REFERENCES Medicamento(idMedicamento)
);

CREATE TABLE Turno (
    idTurno INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipoTurno VARCHAR(50),
    horaInicio TIME,
    horaFin TIME,
    fecha DATE
);

CREATE TABLE Asignacion (
    idAsignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fijo VARCHAR(100),
    idEnfermero INT,
    idArea INT,
    idTurno INT,
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero),
    FOREIGN KEY (idArea) REFERENCES AreaHospital(idArea),
    FOREIGN KEY (idTurno) REFERENCES Turno(idTurno)
);

CREATE TABLE Insumo (
    idInsumo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    cantidadDisponible INT
);

CREATE TABLE RegistroInsumo (
    idRegistroInsumo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaHora TIMESTAMP,
    cantidadUsada INT,
    idPaciente INT,
    idInsumo INT,
    idEnfermero INT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente),
    FOREIGN KEY (idInsumo) REFERENCES Insumo(idInsumo),
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero)
);

CREATE TABLE Capacitacion (
    idCapacitacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    tipo VARCHAR(50),
    fecha DATE,
    responsable VARCHAR(100)
);

CREATE TABLE ParticipacionCapacitacion (
    idParticipacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    estado VARCHAR(50),
    idCapacitacion INT,
    idEnfermero INT,
    FOREIGN KEY (idCapacitacion) REFERENCES Capacitacion(idCapacitacion),
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero)
);

CREATE TABLE EvaluacionDesempeno (
    idEvaluacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha DATE,
    puntaje DECIMAL(5,2),
    observaciones TEXT,
    idEnfermero INT,
    FOREIGN KEY (idEnfermero) REFERENCES Enfermero(idEnfermero)
);
