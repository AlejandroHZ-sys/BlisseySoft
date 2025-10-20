"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function NurseTable() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  const nurses = [
    { id: 1, name: "Ana Sánchez", area: "Urgencias", status: "Activo" },
    { id: 2, name: "Luis García", area: "UCI", status: "Activo" },
    { id: 3, name: "María Fernández", area: "Cirugía", status: "Inactivo" },
  ];

  const filtered = nurses.filter(
    (n) =>
      n.name.toLowerCase().includes(search.toLowerCase()) &&
      (areaFilter === "" || n.area === areaFilter)
  );

  return (
    <div>
      {/* 🔍 Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar enfermero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:ring-2 focus:ring-primary-300"
          />
        </div>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Área</option>
          <option value="Urgencias">Urgencias</option>
          <option value="UCI">UCI</option>
          <option value="Cirugía">Cirugía</option>
        </select>
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2 font-semibold text-center">Nombre</th>
              <th className="p-2 font-semibold text-center">Área Base</th>
              <th className="p-2 font-semibold text-center">Estado</th>
              <th className="p-2 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map((nurse) => (
              <tr key={nurse.id} className="hover:bg-cyan-50 transition">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700">
                    {nurse.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="font-medium text-gray-700">{nurse.name}</span>
                </td>
                <td className="p-3 text-center text-gray-600">{nurse.area}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      nurse.status === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {nurse.status}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-3 py-1 rounded-lg text-xs font-semibold transition"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold transition"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
