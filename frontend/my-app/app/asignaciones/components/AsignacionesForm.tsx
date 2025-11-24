"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEnfermeros } from "@/app/context/EnfermerosContext";

const MySwal = withReactContent(Swal);

type Turno = {
  id: string;
  nombre: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  area?: string;
  diasSemana?: string[];
};

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

type AsignacionesFormProps = {
  asignacion: Asignacion | null;
  asignaciones: Asignacion[]; // Para validar duplicados
  turnos: Turno[];
  onAdd: (asignacion: Asignacion) => void;
  onUpdate: (asignacion: Asignacion) => void;
  onCancel: () => void;
};

export default function AsignacionesForm({
  asignacion,
  asignaciones,
  turnos,
  onAdd,
  onUpdate,
  onCancel,
}: AsignacionesFormProps) {
  const { getEnfermerosActivos } = useEnfermeros();
  const enfermerosActivos = getEnfermerosActivos();
  
  const [enfermeroId, setEnfermeroId] = useState("");
  const [searchEnfermero, setSearchEnfermero] = useState("");
  const [turnoId, setTurnoId] = useState("");
  const [area, setArea] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState<"Activa" | "Finalizada">("Activa");

  // Filtrar enfermeros por búsqueda
  const enfermerosFiltrados = enfermerosActivos.filter((e) =>
    e.name.toLowerCase().includes(searchEnfermero.toLowerCase()) ||
    e.id.toLowerCase().includes(searchEnfermero.toLowerCase()) ||
    (e.area && e.area.toLowerCase().includes(searchEnfermero.toLowerCase()))
  );

  // Turno seleccionado para mostrar detalles
  const turnoSeleccionado = turnos.find((t) => t.id === turnoId);

  // Verificar si el turno de la asignación fue desactivado
  const turnoDesactivado = asignacion && !turnos.find((t) => t.id === asignacion.turnoId);

  // Áreas válidas basadas en el turno seleccionado
  const areasValidas = turnoSeleccionado?.area
    ? [turnoSeleccionado.area]
    : [
        "Urgencias",
        "UCI",
        "Pediatría",
        "Cirugía",
        "Hospitalización",
        "Maternidad",
        "Consulta Externa",
      ];

  // Cargar datos en modo edición
  useEffect(() => {
    if (asignacion) {
      setEnfermeroId(asignacion.enfermeroId);
      setTurnoId(asignacion.turnoId);
      setArea(asignacion.area);
      setFecha(asignacion.fecha);
      setEstado(asignacion.estado);
    } else {
      resetForm();
    }
  }, [asignacion]);

  // Actualizar área automáticamente si el turno tiene área específica
  useEffect(() => {
    if (turnoSeleccionado?.area) {
      setArea(turnoSeleccionado.area);
    }
  }, [turnoSeleccionado]);

  const resetForm = () => {
    setEnfermeroId("");
    setSearchEnfermero("");
    setTurnoId("");
    setArea("");
    setFecha("");
    setEstado("Activa");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!enfermeroId) {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar un enfermero",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!turnoId) {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar un turno",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!area) {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar un área",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!fecha) {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar una fecha",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // VALIDACIÓN: Verificar que el enfermero no tenga dos asignaciones activas en la misma fecha
    const asignacionDuplicada = asignaciones.find(
      (a) =>
        a.enfermeroId === enfermeroId &&
        a.fecha === fecha &&
        a.estado === "Activa" &&
        a.id !== asignacion?.id // Excluir la asignación actual en modo edición
    );

    if (asignacionDuplicada) {
      const enfermeroNombre = enfermerosActivos.find((e) => e.id === enfermeroId)?.name;
      MySwal.fire({
        title: "Asignación Duplicada",
        html: `<p>El enfermero <strong>${enfermeroNombre}</strong> ya tiene una asignación activa en la fecha <strong>${fecha}</strong>.</p>
               <p class="text-sm text-gray-600 mt-2">Turno actual: ${asignacionDuplicada.turnoNombre} - ${asignacionDuplicada.area}</p>`,
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const enfermeroSeleccionado = enfermerosActivos.find((e) => e.id === enfermeroId);
    const turnoSeleccionado = turnos.find((t) => t.id === turnoId);

    const asignacionData: Asignacion = {
      id: asignacion?.id || `ASG${Date.now()}`,
      enfermeroId,
      enfermeroNombre: enfermeroSeleccionado?.name || "",
      turnoId,
      turnoNombre: turnoSeleccionado?.nombre || "",
      area,
      fecha,
      estado,
      horaInicio: turnoSeleccionado?.horaInicio,
      horaFin: turnoSeleccionado?.horaFin,
      fechaFin: estado === "Finalizada" ? new Date().toISOString().split("T")[0] : undefined,
    };

    if (asignacion) {
      onUpdate(asignacionData);
    } else {
      onAdd(asignacionData);
    }

    MySwal.fire({
      title: "¡Éxito!",
      text: `Asignación ${asignacion ? "actualizada" : "creada"} correctamente`,
      icon: "success",
      confirmButtonColor: "#10b981",
    });

    if (!asignacion) {
      resetForm();
    }
  };

  const handleCancel = () => {
    MySwal.fire({
      title: "¿Cancelar?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        onCancel();
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {asignacion ? "Editar Asignación" : "Nueva Asignación"}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cerrar"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Advertencia si el turno fue desactivado */}
        {turnoDesactivado && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Advertencia:</strong> El turno asignado originalmente ha sido desactivado.
                  Debes seleccionar un nuevo turno activo para actualizar esta asignación.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. Seleccionar Enfermero */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            👤 Seleccionar Enfermero
          </h3>
          
          {/* Campo de búsqueda */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar enfermero
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, ID o área..."
                value={searchEnfermero}
                onChange={(e) => setSearchEnfermero(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfermero *
            </label>
            <select
              required
              value={enfermeroId}
              onChange={(e) => setEnfermeroId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Seleccionar enfermero...</option>
              {enfermerosFiltrados.length > 0 ? (
                enfermerosFiltrados.map((enfermero) => (
                  <option key={enfermero.id} value={enfermero.id}>
                    {enfermero.name} - Área base: {enfermero.area || "Sin área"}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No se encontraron enfermeros
                </option>
              )}
            </select>
            {searchEnfermero && (
              <p className="text-xs text-gray-500 mt-1">
                📊 Mostrando {enfermerosFiltrados.length} de {enfermerosActivos.length} enfermeros
              </p>
            )}
          </div>
        </div>

        {/* 2. Seleccionar Turno */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🕒 Seleccionar Turno
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turno *
            </label>
            <select
              required
              value={turnoId}
              onChange={(e) => setTurnoId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Seleccionar turno...</option>
              {turnos.map((turno) => (
                <option key={turno.id} value={turno.id}>
                  {turno.nombre} ({turno.tipo}) - {turno.horaInicio} a{" "}
                  {turno.horaFin}
                </option>
              ))}
            </select>

            {/* Detalles del turno seleccionado */}
            {turnoSeleccionado && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold">Horario:</span>{" "}
                    {turnoSeleccionado.horaInicio} -{" "}
                    {turnoSeleccionado.horaFin}
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    🔄 Sincronizado en tiempo real
                  </span>
                </div>
                {turnoSeleccionado.diasSemana &&
                  turnoSeleccionado.diasSemana.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold">Días aplicables:</span>{" "}
                      {turnoSeleccionado.diasSemana.join(", ")}
                    </div>
                  )}
                <div className="text-sm">
                  <span className="font-semibold">Área del turno:</span>{" "}
                  {turnoSeleccionado.area || "Turno General (Todas las áreas)"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Seleccionar Área */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🏥 Seleccionar Área Operativa
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área *
            </label>
            <select
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              disabled={turnoSeleccionado?.area ? true : false}
            >
              <option value="">Seleccionar área...</option>
              {areasValidas.map((areaOption) => (
                <option key={areaOption} value={areaOption}>
                  {areaOption}
                </option>
              ))}
            </select>
            {turnoSeleccionado?.area && (
              <p className="text-xs text-gray-500 mt-1">
                💡 El área está determinada por el turno seleccionado
              </p>
            )}
          </div>
        </div>

        {/* 4. Fecha del Turno */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            📅 Fecha del Turno
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 5. Estado de la Asignación */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            📌 Estado de la Asignación
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              required
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as "Activa" | "Finalizada")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Activa">Activa</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            {asignacion ? "Actualizar Asignación" : "Guardar Asignación"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
