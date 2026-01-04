"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useEffect, useMemo, useState } from "react";
import { useCamasStore, type Cama } from "@/lib/camasStore";

export default function CamasPage() {
  const { camas, loading, error, fetchCamas, addCama, editCama, removeCama } =
    useCamasStore();

  const [selected, setSelected] = useState<Cama | null>(null);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("");
  const [estado, setEstado] = useState<string>("");

  useEffect(() => {
    fetchCamas();
  }, [fetchCamas]);

  const filtered = useMemo(() => {
    return camas.filter((c) => {
      const byText =
        q.trim() === "" ||
        c.identificador.toLowerCase().includes(q.toLowerCase()) ||
        c.habitacion.toLowerCase().includes(q.toLowerCase());
      const byArea = area === "" || area === "Todos" || c.area === area;
      const byEstado = estado === "" || estado === "Todos" || c.estado === estado;
      return byText && byArea && byEstado;
    });
  }, [camas, q, area, estado]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: selected?.id || 0,
      identificador: formData.get("identificador") as string,
      habitacion: formData.get("habitacion") as string,
      area: formData.get("area") as string,
      estado: formData.get("estado") as Cama["estado"],
    };

    if (!data.identificador.trim()) return alert("Identificador requerido");
    if (!data.habitacion) return alert("Habitación requerida");
    if (!data.area) return alert("Área requerida");

    if (selected) {
      await editCama(selected.id, data);
    } else {
      await addCama(data);
    }
    setSelected(null);
    e.currentTarget.reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta cama?")) {
      await removeCama(id);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      Disponible: "bg-green-100 text-green-800",
      Ocupada: "bg-red-100 text-red-800",
      "En Mantenimiento": "bg-yellow-100 text-yellow-800",
      Reservada: "bg-blue-100 text-blue-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const estadisticas = useMemo(() => {
    return {
      total: camas.length,
      disponibles: camas.filter((c) => c.estado === "Disponible").length,
      ocupadas: camas.filter((c) => c.estado === "Ocupada").length,
      mantenimiento: camas.filter((c) => c.estado === "En Mantenimiento").length,
    };
  }, [camas]);

  return (
    <LayoutDashboard>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Camas
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{estadisticas.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-600">Disponibles</p>
            <p className="text-2xl font-bold text-green-800">{estadisticas.disponibles}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-sm text-red-600">Ocupadas</p>
            <p className="text-2xl font-bold text-red-800">{estadisticas.ocupadas}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-600">En Mantenimiento</p>
            <p className="text-2xl font-bold text-yellow-800">{estadisticas.mantenimiento}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {selected ? "Editar Cama" : "Registrar Nueva Cama"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificador
                </label>
                <input
                  name="identificador"
                  defaultValue={selected?.identificador || ""}
                  placeholder="Ej. C-01, C-02"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitación
                </label>
                <input
                  name="habitacion"
                  defaultValue={selected?.habitacion || ""}
                  placeholder="Ej. H-101, H-201"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  name="area"
                  defaultValue={selected?.area || ""}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar área</option>
                  <option value="Urgencias">Urgencias</option>
                  <option value="UCI">UCI</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Hospitalización">Hospitalización</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  defaultValue={selected?.estado || "Disponible"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupada">Ocupada</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                  <option value="Reservada">Reservada</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                {selected ? "Actualizar" : "Registrar"} Cama
              </button>
            </div>
          </form>
        </div>

        {/* Filtros y Tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Listado de Camas
          </h2>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por identificador o habitación..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las áreas</option>
              <option value="Urgencias">Urgencias</option>
              <option value="UCI">UCI</option>
              <option value="Cirugía">Cirugía</option>
              <option value="Pediatría">Pediatría</option>
              <option value="Hospitalización">Hospitalización</option>
            </select>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="Reservada">Reservada</option>
            </select>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando camas...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Identificador
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Habitación
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No se encontraron camas
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cama) => (
                      <tr key={cama.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {cama.identificador}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {cama.habitacion}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {cama.area}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                              cama.estado
                            )}`}
                          >
                            {cama.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelected(cama)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(cama.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LayoutDashboard>
  );
}
