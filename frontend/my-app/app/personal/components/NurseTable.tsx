"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type Nurse = {
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

type Props = {
  nursesData: Nurse[];
  onDelete: (id: string) => void;
  onEdit: (nurse: Nurse) => void;
};

export default function NurseTable({ nursesData, onDelete, onEdit }: Props) {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("");

  const handleDelete = async (nurse: Nurse) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas eliminar el registro de <strong>${nurse.name}</strong> (${nurse.id})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      onDelete(nurse.id);
      
      MySwal.fire({
        title: 'Eliminado',
        text: `El registro de ${nurse.name} ha sido eliminado.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const filtered = nursesData.filter(
    (n) => {
      // Búsqueda por nombre o ID (case insensitive)
      const searchLower = search.toLowerCase();
      const matchesSearch = search === "" || 
        n.name.toLowerCase().includes(searchLower) || 
        n.id.toLowerCase().includes(searchLower);
      
      // Filtro por área
      const matchesArea = areaFilter === "" || n.area === areaFilter;
      
      // Filtro por turno
      const matchesTurno = turnoFilter === "" || n.turno === turnoFilter;
      
      return matchesSearch && matchesArea && matchesTurno;
    }
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
            placeholder="Buscar por nombre o ID..."
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
          <option value="">Todas las áreas</option>
          <option value="Urgencias">Urgencias</option>
          <option value="UCI">UCI</option>
          <option value="Cirugía">Cirugía</option>
          <option value="Hospitalización">Hospitalización</option>
          <option value="Pediatría">Pediatría</option>
          <option value="Maternidad">Maternidad</option>
        </select>

        <select
          value={turnoFilter}
          onChange={(e) => setTurnoFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Todos los turnos</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
          <option value="Nocturno">Nocturno</option>
        </select>
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2 font-semibold text-center">Nombre completo</th>
              <th className="p-2 font-semibold text-center">Área asignada</th>
              <th className="p-2 font-semibold text-center">Turno actual</th>
              <th className="p-2 font-semibold text-center">Estado</th>
              <th className="p-2 font-semibold text-center">Última actualización</th>
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
                <td className="p-3 text-center text-gray-600">{nurse.turno}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      nurse.status === "Activo"
                        ? "bg-green-100 text-green-700"
                        : nurse.status === "Rotación"
                        ? "bg-blue-100 text-blue-700"
                        : nurse.status === "Fuera de turno"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {nurse.status}
                  </span>
                </td>
                <td className="p-3 text-center text-gray-500 text-xs">{nurse.lastUpdate}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(nurse)}
                    className="bg-cyan-100 hover:bg-cyan-200 active:scale-95 transition transform text-cyan-700 px-3 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(nurse)}
                    className="bg-red-100 hover:bg-red-200 active:scale-95 transition transform text-red-600 px-3 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-300"
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
