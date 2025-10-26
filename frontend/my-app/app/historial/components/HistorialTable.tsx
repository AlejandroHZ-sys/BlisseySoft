"use client";

import { useRouter } from "next/navigation";
import { HistorialRecord } from "../page";

type Props = {
  data: HistorialRecord[];
  onSelect: (r: HistorialRecord) => void;
  onDelete: (id: string) => void;
};

export default function HistorialTable({ data, onSelect, onDelete }: Props) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-left table-auto">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-3">Fecha / Hora</th>
            <th className="px-4 py-3">Paciente</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Profesional</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Diagnóstico</th>
            <th className="px-4 py-3 w-36">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
                Sin resultados
              </td>
            </tr>
          )}
          {data.map((r) => (
            <Row key={r.id} r={r} onSelect={onSelect} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ r, onSelect, onDelete }: { r: HistorialRecord; onSelect: (r: HistorialRecord) => void; onDelete: (id: string) => void }) {
  const router = useRouter();

  return (
    <tr
      className="border-t align-top hover:bg-blue-50 cursor-pointer"
      onClick={() => router.push(`/historial/${r.id}`)}
    >
      <td className="px-4 py-3">{new Date(r.datetime).toLocaleString()}</td>
      <td className="px-4 py-3">{r.patientFullName}</td>
      <td className="px-4 py-3">{r.type}</td>
      <td className="px-4 py-3">{r.professional}</td>
      <td className="px-4 py-3">{r.status}</td>
      <td className="px-4 py-3">{(r.initialDiagnosis || r.finalDiagnosis || "").slice(0, 120)}</td>
      <td className="px-4 py-3 w-36">
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(r);
            }}
            className="text-sm text-blue-600 px-2 py-1 whitespace-nowrap rounded hover:bg-blue-100 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(r.id);
            }}
            className="text-sm text-red-600 px-2 py-1 whitespace-nowrap rounded hover:bg-red-100 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
