"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Enfermero = {
  id: string;
  name: string;
  curp: string;
  area: string;
  turno: string;
  status: string;
  lastUpdate: string;
  position: string;
  date: string;
  available: boolean;
  employeeNumber?: string;
  institutionalPhone?: string;
  institutionalEmail?: string;
  specialty?: string;
};

type EnfermerosContextType = {
  enfermeros: Enfermero[];
  addEnfermero: (enfermero: Enfermero) => void;
  updateEnfermero: (enfermero: Enfermero) => void;
  deleteEnfermero: (id: string) => void;
  getEnfermerosActivos: () => Enfermero[];
};

const EnfermerosContext = createContext<EnfermerosContextType | undefined>(undefined);

export function EnfermerosProvider({ children }: { children: ReactNode }) {
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([
    { 
      id: "ENF001", 
      name: "Ana Sánchez",
      curp: "SAAN800101MDFNNN01",
      area: "Urgencias", 
      turno: "Matutino",
      status: "Activo",
      lastUpdate: "2025-11-24 08:30",
      position: "Enfermero General",
      date: "2020-01-15",
      available: true
    },
    { 
      id: "ENF002", 
      name: "Luis García",
      curp: "GAAL850505HDFRRS02",
      area: "UCI", 
      turno: "Nocturno",
      status: "Activo",
      lastUpdate: "2025-11-24 07:15",
      position: "Enfermero Especialista",
      date: "2019-03-10",
      available: true
    },
    { 
      id: "ENF003", 
      name: "María López",
      curp: "LOPM900315MDFPPR03",
      area: "Pediatría", 
      turno: "Matutino",
      status: "Activo",
      lastUpdate: "2025-11-24 09:00",
      position: "Enfermero General",
      date: "2021-06-20",
      available: true
    },
    { 
      id: "ENF004", 
      name: "Carlos Hernández",
      curp: "HERC920820HDFRRR04",
      area: "Cirugía", 
      turno: "Vespertino",
      status: "Activo",
      lastUpdate: "2025-11-24 08:45",
      position: "Enfermero Quirúrgico",
      date: "2018-02-10",
      available: true,
      specialty: "Cirugía"
    },
    { 
      id: "ENF005", 
      name: "Rosa Martínez",
      curp: "MARR880210MDFRRS05",
      area: "Hospitalización", 
      turno: "Nocturno",
      status: "Activo",
      lastUpdate: "2025-11-24 07:30",
      position: "Enfermero General",
      date: "2020-09-15",
      available: true
    },
    { 
      id: "ENF006", 
      name: "Jorge Ramírez",
      curp: "RAMJ870605HDFMRR06",
      area: "Urgencias", 
      turno: "Matutino",
      status: "Activo",
      lastUpdate: "2025-11-24 08:15",
      position: "Enfermero de Urgencias",
      date: "2019-11-20",
      available: true,
      specialty: "Urgencias"
    },
    { 
      id: "ENF007", 
      name: "Patricia Gómez",
      curp: "GOMP910418MDFMMT07",
      area: "Maternidad", 
      turno: "Vespertino",
      status: "Activo",
      lastUpdate: "2025-11-24 08:00",
      position: "Enfermero Obstétrico",
      date: "2020-03-12",
      available: true,
      specialty: "Obstetricia"
    },
    { 
      id: "ENF008", 
      name: "Roberto Torres",
      curp: "TORR860725HDFRRT08",
      area: "UCI", 
      turno: "Nocturno",
      status: "Inactivo",
      lastUpdate: "2025-11-20 10:00",
      position: "Enfermero Especialista",
      date: "2017-08-05",
      available: false
    },
  ]);

  const addEnfermero = (enfermero: Enfermero) => {
    setEnfermeros([...enfermeros, enfermero]);
  };

  const updateEnfermero = (updatedEnfermero: Enfermero) => {
    setEnfermeros(
      enfermeros.map((enfermero) =>
        enfermero.id === updatedEnfermero.id ? updatedEnfermero : enfermero
      )
    );
  };

  const deleteEnfermero = (id: string) => {
    setEnfermeros(enfermeros.filter((enfermero) => enfermero.id !== id));
  };

  const getEnfermerosActivos = () => {
    return enfermeros.filter((enfermero) => enfermero.status === "Activo");
  };

  return (
    <EnfermerosContext.Provider
      value={{
        enfermeros,
        addEnfermero,
        updateEnfermero,
        deleteEnfermero,
        getEnfermerosActivos,
      }}
    >
      {children}
    </EnfermerosContext.Provider>
  );
}

export function useEnfermeros() {
  const context = useContext(EnfermerosContext);
  if (context === undefined) {
    throw new Error("useEnfermeros must be used within an EnfermerosProvider");
  }
  return context;
}
