"use client";

import { useState } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import TurnosTable from "./components/TurnosTable";
import TurnosForm from "./components/TurnosForm";
import { Plus } from "lucide-react";
import { useTurnos, type Turno } from "../context/TurnosContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function TurnosPage() {
  const {
    turnos: turnosData,
    addTurno,
    updateTurno,
    deleteTurno,
    duplicateTurno,
    toggleStatus,
  } = useTurnos();

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Función auxiliar para verificar solapamiento de turnos
  const verificarSolapamiento = (
    nuevoTurno: Turno,
    turnosExistentes: Turno[]
  ): boolean => {
    const [nuevaHoraInicio, nuevoMinInicio] = nuevoTurno.horaInicio
      .split(":")
      .map(Number);
    const [nuevaHoraFin, nuevoMinFin] = nuevoTurno.horaFin
      .split(":")
      .map(Number);

    const nuevosMinutosInicio = nuevaHoraInicio * 60 + nuevoMinInicio;
    let nuevosMinutosFin = nuevaHoraFin * 60 + nuevoMinFin;

    // Si el turno cruza medianoche, ajustar
    if (nuevosMinutosFin < nuevosMinutosInicio) {
      nuevosMinutosFin += 24 * 60;
    }

    // Verificar contra cada turno existente (excepto el que se está editando)
    for (const turnoExistente of turnosExistentes) {
      if (turnoExistente.id === nuevoTurno.id) continue; // Saltar el mismo turno en edición

      // Solo verificar si es la misma área o si alguno es general
      const mismAreaOGeneral =
        !nuevoTurno.area ||
        !turnoExistente.area ||
        nuevoTurno.area === turnoExistente.area;

      if (!mismAreaOGeneral) continue;

      // Verificar si comparten días de la semana
      const compartenDias =
        !nuevoTurno.diasSemana ||
        !turnoExistente.diasSemana ||
        nuevoTurno.diasSemana.length === 0 ||
        turnoExistente.diasSemana.length === 0 ||
        nuevoTurno.diasSemana.some((dia) =>
          turnoExistente.diasSemana?.includes(dia)
        );

      if (!compartenDias) continue;

      const [existenteHoraInicio, existenteMinInicio] = turnoExistente.horaInicio
        .split(":")
        .map(Number);
      const [existenteHoraFin, existenteMinFin] = turnoExistente.horaFin
        .split(":")
        .map(Number);

      const existentesMinutosInicio =
        existenteHoraInicio * 60 + existenteMinInicio;
      let existentesMinutosFin = existenteHoraFin * 60 + existenteMinFin;

      // Si el turno existente cruza medianoche, ajustar
      if (existentesMinutosFin < existentesMinutosInicio) {
        existentesMinutosFin += 24 * 60;
      }

      // Verificar solapamiento
      if (
        (nuevosMinutosInicio >= existentesMinutosInicio &&
          nuevosMinutosInicio < existentesMinutosFin) ||
        (nuevosMinutosFin > existentesMinutosInicio &&
          nuevosMinutosFin <= existentesMinutosFin) ||
        (nuevosMinutosInicio <= existentesMinutosInicio &&
          nuevosMinutosFin >= existentesMinutosFin)
      ) {
        return true; // Hay solapamiento
      }
    }

    return false; // No hay solapamiento
  };

  // Handlers CRUD
  const handleAddTurno = (turno: Turno) => {
    // Validación 4: Verificar solapamiento de turnos
    if (verificarSolapamiento(turno, turnosData)) {
      MySwal.fire({
        title: "Advertencia",
        text: "Este turno se solapa con otro turno existente en la misma área y días. ¿Deseas crearlo de todas formas?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, crear de todas formas",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          addTurno(turno);
          setShowForm(false);
        }
      });
    } else {
      addTurno(turno);
      setShowForm(false);
    }
  };

  const handleUpdateTurno = (updatedTurno: Turno) => {
    // Validación 4: Verificar solapamiento de turnos
    if (verificarSolapamiento(updatedTurno, turnosData)) {
      MySwal.fire({
        title: "Advertencia",
        text: "Este turno se solapa con otro turno existente en la misma área y días. ¿Deseas actualizarlo de todas formas?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, actualizar de todas formas",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          updateTurno(updatedTurno);
          setSelectedTurno(null);
          setShowForm(false);
        }
      });
    } else {
      updateTurno(updatedTurno);
      setSelectedTurno(null);
      setShowForm(false);
    }
  };

  const handleDeleteTurno = (id: string) => {
    // Validación 5: No eliminar turnos con asignaciones activas
    const turnoAEliminar = turnosData.find((turno) => turno.id === id);
    
    if (turnoAEliminar?.tieneAsignaciones) {
      MySwal.fire({
        title: "No se puede eliminar",
        text: "Este turno tiene asignaciones activas. Primero debes liberar las asignaciones antes de eliminarlo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    deleteTurno(id);
    if (selectedTurno?.id === id) {
      setSelectedTurno(null);
      setShowForm(false);
    }
  };

  const handleDuplicateTurno = (turno: Turno) => {
    duplicateTurno(turno);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
  };

  const handleNewTurno = () => {
    setSelectedTurno(null);
    setShowForm(true);
  };

  const handleEditTurno = (turno: Turno) => {
    setSelectedTurno(turno);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedTurno(null);
    setShowForm(false);
  };

  return (
    <LayoutDashboard>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestión de Turnos
            </h1>
            <p className="text-gray-600 mt-2">
              Administra los turnos y horarios del personal de enfermería
            </p>
          </div>

          {/* Botón principal de acción */}
          <button
            onClick={handleNewTurno}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Registrar Turno
          </button>
        </div>

        {/* Contenido principal */}
        <div
          className={`grid gap-6 ${showForm ? "grid-cols-3" : "grid-cols-1"}`}
        >
          {/* Tabla de turnos */}
          <div className={showForm ? "col-span-2" : "col-span-1"}>
            <TurnosTable
              turnosData={turnosData}
              onDelete={handleDeleteTurno}
              onEdit={handleEditTurno}
              onDuplicate={handleDuplicateTurno}
              onToggleStatus={handleToggleStatus}
            />
          </div>

          {/* Formulario lateral */}
          {showForm && (
            <div className="col-span-1">
              <TurnosForm
                turno={selectedTurno}
                onAdd={handleAddTurno}
                onUpdate={handleUpdateTurno}
                onCancel={handleCancelForm}
              />
            </div>
          )}
        </div>
      </div>
    </LayoutDashboard>
  );
}
