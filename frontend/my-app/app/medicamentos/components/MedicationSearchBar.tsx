"use client";

interface Props {
  q: string;
  onQ: (q: string) => void;
  tipo: string;
  onTipo: (tipo: string) => void;
}

const TIPOS = ["Todos", "Medicamento", "Insumo"];

export default function MedicationSearchBar({ q, onQ, tipo, onTipo }: Props) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Buscar por nombre o presentación..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tipo Select */}
      <select
        value={tipo}
        onChange={(e) => onTipo(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TIPOS.map((t) => (
          <option key={t} value={t}>
            {t === "Todos" ? `Todos los Tipos` : t}
          </option>
        ))}
      </select>
    </div>
  );
}
