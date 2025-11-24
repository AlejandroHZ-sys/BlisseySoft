"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Turno = {
  id: string;
  nombre: string;
  tipo: "Matutino" | "Vespertino" | "Nocturno" | "Especial";
  horaInicio: string;
  horaFin: string;
  estado: "Activo" | "Inactivo" | "Especial";
  area?: string;
  descripcion?: string;
  diasSemana?: string[];
  tieneAsignaciones?: boolean;
};

type TurnosContextType = {
  turnos: Turno[];
  addTurno: (turno: Turno) => void;
  updateTurno: (turno: Turno) => void;
  deleteTurno: (id: string) => void;
  duplicateTurno: (turno: Turno) => void;
  toggleStatus: (id: string) => void;
  getTurnosActivos: () => Turno[];
};

const TurnosContext = createContext<TurnosContextType | undefined>(undefined);

export function TurnosProvider({ children }: { children: ReactNode }) {
  const [turnos, setTurnos] = useState<Turno[]>([
    {
      id: "TUR001",
      nombre: "Turno Matutino Regular",
      tipo: "Matutino",
      horaInicio: "08:00",
      horaFin: "16:00",
      estado: "Activo",
      descripcion: "Turno matutino estándar",
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      tieneAsignaciones: true,
    },
    {
      id: "TUR002",
      nombre: "Turno Vespertino Regular",
      tipo: "Vespertino",
      horaInicio: "16:00",
      horaFin: "00:00",
      estado: "Activo",
      descripcion: "Turno vespertino estándar",
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      tieneAsignaciones: false,
    },
    {
      id: "TUR003",
      nombre: "Turno Nocturno Regular",
      tipo: "Nocturno",
      horaInicio: "00:00",
      horaFin: "08:00",
      estado: "Activo",
      descripcion: "Turno nocturno estándar",
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      tieneAsignaciones: true,
    },
    {
      id: "TUR004",
      nombre: "Turno Fin de Semana UCI",
      tipo: "Especial",
      horaInicio: "08:00",
      horaFin: "20:00",
      estado: "Activo",
      area: "UCI",
      descripcion: "Turno especial para fines de semana en UCI",
      diasSemana: ["Sábado", "Domingo"],
      tieneAsignaciones: false,
    },
    {
      id: "TUR005",
      nombre: "Turno de Emergencia",
      tipo: "Especial",
      horaInicio: "00:00",
      horaFin: "23:59",
      estado: "Inactivo",
      descripcion: "Turno de 24 horas para emergencias",
      tieneAsignaciones: false,
    },
  ]);

  const addTurno = (turno: Turno) => {
    setTurnos([...turnos, turno]);
  };

  const updateTurno = (updatedTurno: Turno) => {
    setTurnos(
      turnos.map((turno) =>
        turno.id === updatedTurno.id ? updatedTurno : turno
      )
    );
  };

  const deleteTurno = (id: string) => {
    setTurnos(turnos.filter((turno) => turno.id !== id));
  };

  const duplicateTurno = (turno: Turno) => {
    const duplicatedTurno: Turno = {
      ...turno,
      id: `TUR${Date.now()}`,
      nombre: `${turno.nombre} (Copia)`,
    };
    setTurnos([...turnos, duplicatedTurno]);
  };

  const toggleStatus = (id: string) => {
    setTurnos(
      turnos.map((turno) =>
        turno.id === id
          ? {
              ...turno,
              estado: turno.estado === "Activo" ? "Inactivo" : "Activo",
            }
          : turno
      )
    );
  };

  const getTurnosActivos = () => {
    return turnos.filter((turno) => turno.estado === "Activo");
  };

  return (
    <TurnosContext.Provider
      value={{
        turnos,
        addTurno,
        updateTurno,
        deleteTurno,
        duplicateTurno,
        toggleStatus,
        getTurnosActivos,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
}

export function useTurnos() {
  const context = useContext(TurnosContext);
  if (context === undefined) {
    throw new Error("useTurnos must be used within a TurnosProvider");
  }
  return context;
}
