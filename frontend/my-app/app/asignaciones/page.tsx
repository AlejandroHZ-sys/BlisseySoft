"use client";

import { useState } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import AsignacionesTable from "./components/AsignacionesTable";
import AsignacionesForm from "./components/AsignacionesForm";
import { Plus } from "lucide-react";
import { useTurnos } from "../context/TurnosContext";

// Tipos de datos
type Asignacion = {
  id: string;
  enfermeroId: string;
  enfermeroNombre: string;
  turnoId: string;
  turnoNombre: string;
  area: string;
  fecha: string;
  estado: "Activa" | "Finalizada";
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
};

export default function AsignacionesPage() {
  // Obtener turnos desde el contexto - solo turnos activos
  const { getTurnosActivos } = useTurnos();
  const turnosActivos = getTurnosActivos();

  // Estado de asignaciones
  const [asignacionesData, setAsignacionesData] = useState<Asignacion[]>([
    {
      id: "ASG001",
      enfermeroId: "ENF001",
      enfermeroNombre: "Ana Sánchez",
      turnoId: "TUR001",
      turnoNombre: "Turno Matutino Regular",
      area: "Urgencias",
      fecha: "2025-11-24",
      estado: "Activa",
      horaInicio: "08:00",
      horaFin: "16:00",
    },
    {
      id: "ASG002",
      enfermeroId: "ENF002",
      enfermeroNombre: "Luis García",
      turnoId: "TUR004",
      turnoNombre: "Turno Fin de Semana UCI",
      area: "UCI",
      fecha: "2025-11-23",
      estado: "Finalizada",
      fechaFin: "2025-11-23",
      horaInicio: "08:00",
      horaFin: "20:00",
    },
    {
      id: "ASG003",
      enfermeroId: "ENF003",
      enfermeroNombre: "María López",
      turnoId: "TUR003",
      turnoNombre: "Turno Nocturno Regular",
      area: "Pediatría",
      fecha: "2025-11-24",
      estado: "Activa",
      horaInicio: "00:00",
      horaFin: "08:00",
    },
  ]);

  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Handlers CRUD
  const handleAddAsignacion = (asignacion: Asignacion) => {
    setAsignacionesData([...asignacionesData, asignacion]);
    setShowForm(false);
  };

  const handleUpdateAsignacion = (updatedAsignacion: Asignacion) => {
    setAsignacionesData(
      asignacionesData.map((asignacion) =>
        asignacion.id === updatedAsignacion.id ? updatedAsignacion : asignacion
      )
    );
    setSelectedAsignacion(null);
    setShowForm(false);
  };

  const handleDeleteAsignacion = (id: string) => {
    setAsignacionesData(asignacionesData.filter((asignacion) => asignacion.id !== id));
    if (selectedAsignacion?.id === id) {
      setSelectedAsignacion(null);
      setShowForm(false);
    }
  };

  const handleLiberarAsignacion = (id: string) => {
    setAsignacionesData(
      asignacionesData.map((asignacion) =>
        asignacion.id === id
          ? {
              ...asignacion,
              estado: "Finalizada" as const,
              fechaFin: new Date().toISOString().split("T")[0],
            }
          : asignacion
      )
    );
  };

  const handleNewAsignacion = () => {
    setSelectedAsignacion(null);
    setShowForm(true);
  };

  const handleEditAsignacion = (asignacion: Asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedAsignacion(null);
    setShowForm(false);
  };

  return (
    <LayoutDashboard>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Asignación de Turnos
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona las asignaciones de turnos del personal de enfermería
            </p>
          </div>

          {/* Botón principal de acción */}
          <button
            onClick={handleNewAsignacion}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Nueva Asignación
          </button>
        </div>

        {/* Contenido principal */}
        <div
          className={`grid gap-6 ${showForm ? "grid-cols-3" : "grid-cols-1"}`}
        >
          {/* Tabla de asignaciones */}
          <div className={showForm ? "col-span-2" : "col-span-1"}>
            <AsignacionesTable
              asignacionesData={asignacionesData}
              onDelete={handleDeleteAsignacion}
              onEdit={handleEditAsignacion}
              onLiberar={handleLiberarAsignacion}
            />
          </div>

          {/* Formulario lateral */}
          {showForm && (
            <div className="col-span-1">
              <AsignacionesForm
                asignacion={selectedAsignacion}
                asignaciones={asignacionesData}
                turnos={turnosActivos}
                onAdd={handleAddAsignacion}
                onUpdate={handleUpdateAsignacion}
                onCancel={handleCancelForm}
              />
            </div>
          )}
        </div>
      </div>
    </LayoutDashboard>
  );
}
