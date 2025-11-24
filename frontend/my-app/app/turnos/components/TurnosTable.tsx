"use client";

import { useState } from "react";
import { Search, Edit, Trash2, Copy, Power } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type Turno = {
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

type TurnosTableProps = {
  turnosData: Turno[];
  onDelete: (id: string) => void;
  onEdit: (turno: Turno) => void;
  onDuplicate: (turno: Turno) => void;
  onToggleStatus: (id: string) => void;
};

export default function TurnosTable({
  turnosData,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleStatus,
}: TurnosTableProps) {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  // Filtrado
  const filteredTurnos = turnosData.filter((turno) => {
    const matchesSearch =
      search === "" ||
      turno.nombre.toLowerCase().includes(search.toLowerCase()) ||
      turno.id.toLowerCase().includes(search.toLowerCase()) ||
      turno.horaInicio.includes(search) ||
      turno.horaFin.includes(search);

    const matchesEstado =
      estadoFilter === "Todos" || turno.estado === estadoFilter;

    const matchesTipo = tipoFilter === "Todos" || turno.tipo === tipoFilter;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  const handleDelete = (id: string, nombre: string) => {
    MySwal.fire({
      title: "¿Eliminar turno?",
      text: `¿Estás seguro de eliminar el turno "${nombre}"? Esta acción no se puede deshacer.`,
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
          text: `El turno "${nombre}" ha sido eliminado correctamente.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  const handleToggleStatus = (id: string, currentEstado: string) => {
    const newEstado = currentEstado === "Activo" ? "Inactivo" : "Activo";
    MySwal.fire({
      title: `¿${newEstado === "Activo" ? "Activar" : "Desactivar"} turno?`,
      text: `¿Estás seguro de ${
        newEstado === "Activo" ? "activar" : "desactivar"
      } este turno?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newEstado === "Activo" ? "#10b981" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onToggleStatus(id);
        MySwal.fire({
          title: "¡Estado actualizado!",
          text: `El turno ha sido ${
            newEstado === "Activo" ? "activado" : "desactivado"
          } correctamente.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  const handleDuplicate = (turno: Turno) => {
    MySwal.fire({
      title: "¿Duplicar turno?",
      text: `¿Deseas crear una copia del turno "${turno.nombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, duplicar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDuplicate(turno);
        MySwal.fire({
          title: "¡Turno duplicado!",
          text: "Se ha creado una copia del turno correctamente.",
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
            placeholder="Buscar por turno, hora o horario (ej: 08:00)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Especial">Especial</option>
            </select>
          </div>

          {/* Filtro por Tipo de Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Turno
            </label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Todos">Todos</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Nocturno">Nocturno</option>
              <option value="Especial">Turno Especial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Nombre del Turno
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Área
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Horario
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
            {filteredTurnos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron turnos
                </td>
              </tr>
            ) : (
              filteredTurnos.map((turno) => (
                <tr
                  key={turno.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {turno.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {turno.nombre}
                    </div>
                    {turno.descripcion && (
                      <div className="text-xs text-gray-500 mt-1">
                        {turno.descripcion}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        turno.tipo === "Matutino"
                          ? "bg-yellow-100 text-yellow-800"
                          : turno.tipo === "Vespertino"
                          ? "bg-orange-100 text-orange-800"
                          : turno.tipo === "Nocturno"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {turno.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {turno.area || "Turno General"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="font-medium">
                      {turno.horaInicio} - {turno.horaFin}
                    </div>
                    {turno.diasSemana && turno.diasSemana.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {turno.diasSemana.join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        turno.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : turno.estado === "Inactivo"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {turno.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => onEdit(turno)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar turno"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Botón Duplicar */}
                      <button
                        onClick={() => handleDuplicate(turno)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Duplicar turno"
                      >
                        <Copy size={18} />
                      </button>

                      {/* Botón Activar/Desactivar */}
                      <button
                        onClick={() =>
                          handleToggleStatus(turno.id, turno.estado)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          turno.estado === "Activo"
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          turno.estado === "Activo"
                            ? "Desactivar turno"
                            : "Activar turno"
                        }
                      >
                        <Power size={18} />
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleDelete(turno.id, turno.nombre)}
                        className={`p-2 rounded-lg transition-colors ${
                          turno.tieneAsignaciones
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          turno.tieneAsignaciones
                            ? "No se puede eliminar - Tiene asignaciones activas"
                            : "Eliminar turno"
                        }
                        disabled={turno.tieneAsignaciones}
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
        Mostrando {filteredTurnos.length} de {turnosData.length} turnos
      </div>
    </div>
  );
}
