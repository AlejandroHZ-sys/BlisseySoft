"use client";

import { useState } from "react";
import { Search, Edit, Unlock, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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

type AsignacionesTableProps = {
  asignacionesData: Asignacion[];
  onDelete: (id: string) => void;
  onEdit: (asignacion: Asignacion) => void;
  onLiberar: (id: string) => void;
};

export default function AsignacionesTable({
  asignacionesData,
  onDelete,
  onEdit,
  onLiberar,
}: AsignacionesTableProps) {
  const [search, setSearch] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("Todos");
  const [areaFilter, setAreaFilter] = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [fechaFilter, setFechaFilter] = useState("");

  // Obtener listas únicas para filtros
  const turnosUnicos = Array.from(
    new Set(asignacionesData.map((a) => a.turnoNombre))
  );
  const areasUnicas = Array.from(
    new Set(asignacionesData.map((a) => a.area))
  );

  // Filtrado
  const filteredAsignaciones = asignacionesData.filter((asignacion) => {
    const matchesSearch =
      search === "" ||
      asignacion.id.toLowerCase().includes(search.toLowerCase()) ||
      asignacion.enfermeroNombre.toLowerCase().includes(search.toLowerCase()) ||
      asignacion.turnoNombre.toLowerCase().includes(search.toLowerCase());

    const matchesTurno =
      turnoFilter === "Todos" || asignacion.turnoNombre === turnoFilter;

    const matchesArea =
      areaFilter === "Todos" || asignacion.area === areaFilter;

    const matchesEstado =
      estadoFilter === "Todos" || asignacion.estado === estadoFilter;

    const matchesFecha =
      fechaFilter === "" || asignacion.fecha === fechaFilter;

    return (
      matchesSearch &&
      matchesTurno &&
      matchesArea &&
      matchesEstado &&
      matchesFecha
    );
  });

  const handleDelete = (id: string, estado: string) => {
    if (estado !== "Finalizada") {
      MySwal.fire({
        title: "No se puede eliminar",
        text: "Solo puedes eliminar asignaciones finalizadas. Primero debes liberar la asignación.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    MySwal.fire({
      title: "¿Eliminar asignación?",
      text: "¿Estás seguro de eliminar esta asignación? Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        MySwal.fire({
          title: "¡Eliminado!",
          text: "La asignación ha sido eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  const handleLiberar = (id: string, estado: string) => {
    if (estado === "Finalizada") {
      MySwal.fire({
        title: "Asignación ya finalizada",
        text: "Esta asignación ya ha sido liberada.",
        icon: "info",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    MySwal.fire({
      title: "¿Liberar asignación?",
      text: "¿Estás seguro de marcar esta asignación como finalizada?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, liberar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onLiberar(id);
        MySwal.fire({
          title: "¡Asignación liberada!",
          text: "La asignación ha sido marcada como finalizada.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Buscador y Filtros */}
      <div className="mb-6 space-y-4">
        {/* Buscador */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por ID, enfermero o turno..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turno
            </label>
            <select
              value={turnoFilter}
              onChange={(e) => setTurnoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Todos">Todos</option>
              {turnosUnicos.map((turno) => (
                <option key={turno} value={turno}>
                  {turno}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Todos">Todas</option>
              {areasUnicas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Todos">Todos</option>
              <option value="Activa">Activa</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>

          {/* Filtro por Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                ID Asignación
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Enfermero
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Turno
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Área
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAsignaciones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron asignaciones
                </td>
              </tr>
            ) : (
              filteredAsignaciones.map((asignacion) => (
                <tr
                  key={asignacion.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {asignacion.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {asignacion.enfermeroNombre}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {asignacion.turnoNombre}
                    </div>
                    {asignacion.horaInicio && asignacion.horaFin && (
                      <div className="text-xs text-gray-500 mt-1">
                        {asignacion.horaInicio} - {asignacion.horaFin}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {asignacion.area}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div>{asignacion.fecha}</div>
                    {asignacion.fechaFin && (
                      <div className="text-xs text-gray-500 mt-1">
                        Fin: {asignacion.fechaFin}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        asignacion.estado === "Activa"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {asignacion.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => onEdit(asignacion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar asignación"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Botón Liberar */}
                      <button
                        onClick={() =>
                          handleLiberar(asignacion.id, asignacion.estado)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          asignacion.estado === "Finalizada"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          asignacion.estado === "Finalizada"
                            ? "Asignación ya liberada"
                            : "Liberar asignación"
                        }
                        disabled={asignacion.estado === "Finalizada"}
                      >
                        <Unlock size={18} />
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() =>
                          handleDelete(asignacion.id, asignacion.estado)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          asignacion.estado !== "Finalizada"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          asignacion.estado !== "Finalizada"
                            ? "Solo se pueden eliminar asignaciones finalizadas"
                            : "Eliminar asignación"
                        }
                        disabled={asignacion.estado !== "Finalizada"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contador de resultados */}
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredAsignaciones.length} de {asignacionesData.length}{" "}
        asignaciones
      </div>
    </div>
  );
}
