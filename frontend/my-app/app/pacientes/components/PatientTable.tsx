"use client";

export type PatientStatus = "Activo" | "Observación" | "Alta" | "Traslado";

export type Patient = {
  id: string;
  fullName: string;
  curp: string;
  area: string;
  bed: string;
  sex: string;
  status: PatientStatus;
  nurse: string; // enfermero responsable
};

export default function PatientTable({
  data,
  onSelect,
  onDelete,
}: {
  data: Patient[];
  onSelect: (p: Patient) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-blue-50 text-left">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">CURP</th>
            <th className="p-3">Sexo</th>
            <th className="p-3">Área</th>
            <th className="p-3">Cama</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Enfermero(a)</th>
            <th className="p-3 w-28">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr
              key={p.id || `row-${i}`}
              className={`border-t hover:bg-blue-50`}
            >
              <td className="p-3">{p.fullName}</td>
              <td className="p-3">{p.curp}</td>
              <td className="p-3">{p.sex || '—'}</td>
              <td className="p-3">{p.area}</td>
              <td className="p-3">{p.bed}</td>
              <td
                className={`p-3 font-semibold ${
                  p.status === "Activo"
                    ? "text-green-600"
                    : p.status === "Observación"
                    ? "text-amber-600"
                    : p.status === "Traslado"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {p.status}
              </td>
              <td className="p-3">{p.nurse || "—"}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelect(p)}
                    className="px-2 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200"
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500">
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
