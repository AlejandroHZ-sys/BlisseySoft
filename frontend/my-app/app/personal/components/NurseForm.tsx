"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";

export default function NurseForm() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState("Activo");

  return (
    <form className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-700 mb-2">
        Registro / Edición de Enfermero
      </h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Nombre Completo
        </label>
        <input
          type="text"
          placeholder="Nombre Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Nivel o Puesto
        </label>
        <input
          type="text"
          placeholder="Nivel o Puesto"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Área Base Principal
        </label>
        <input
          type="text"
          placeholder="Área Base Principal"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Fecha de Ingreso
        </label>
        <input
          type="date"
          placeholder="Fecha de Ingreso"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={available}
          onChange={() => setAvailable(!available)}
          className="accent-cyan-600 w-4 h-4"
        />
        <label className="text-sm font-semibold text-gray-600">
          Disponible para turnos
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Documentos</label>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
          <Paperclip size={18} className="text-gray-400" />
          <span className="text-gray-500 text-sm">Subir archivo</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-200"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div className="flex flex-col text-xs text-gray-500 ml-4">
          <span>Cursos pendientes: 2</span>
          <span>Cursos cumplidos: 5</span>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex-1"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
