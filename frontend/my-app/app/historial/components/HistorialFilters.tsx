"use client";

type Props = {
  q: string;
  onQ: (v: string) => void;
  type: string;
  onType: (v: string) => void;
};

export default function HistorialFilters({ q, onQ, type, onType }: Props) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <input
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder="Buscar por notas o doctor..."
        className="flex-1 border rounded px-3 py-2"
      />

      <select value={type} onChange={(e) => onType(e.target.value)} className="border rounded px-3 py-2">
        <option value="">Tipo</option>
        <option value="Nota de enfermería">Nota de enfermería</option>
        <option value="Evolución">Evolución</option>
        <option value="Interconsulta">Interconsulta</option>
      </select>
    </div>
  );
}
