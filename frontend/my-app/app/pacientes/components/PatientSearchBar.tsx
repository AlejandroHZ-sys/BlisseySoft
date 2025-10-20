"use client";

const AREAS = ["", "Urgencias", "UCI", "Cirugía", "Pediatría", "Hospitalización"];
const ESTADOS = ["", "Activo", "Observación", "Alta", "Traslado"];

export default function PatientSearchBar({
  q,
  onQ,
  area,
  onArea,
  estado,
  onEstado,
}: {
  q: string;
  onQ: (v: string) => void;
  area: string;
  onArea: (v: string) => void;
  estado: string;
  onEstado: (v: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <input
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder="Buscar por nombre, CURP o cama…"
        className="flex-1 border rounded-lg p-2"
      />
      <select
        value={area}
        onChange={(e) => onArea(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="" disabled>
          Área
        </option>
        <option value="Todos">Todos</option>
        {AREAS.filter((a) => a !== "").map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <select
        value={estado}
        onChange={(e) => onEstado(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="" disabled>
          Estado
        </option>
        <option value="Todos">Todos</option>
        {ESTADOS.filter((s) => s !== "").map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
