"use client";
import type { Medication } from "../page"; // Importa el tipo

// Reutiliza el componente de píldora de estado si lo tienes
// Si no, aquí hay una versión simple:
function StatusPill({ stock }: { stock: number }) {
  let colorClasses = "bg-green-100 text-green-800";
  let text = "Disponible";

  if (stock === 0) {
    colorClasses = "bg-red-100 text-red-800";
    text = "Agotado";
  } else if (stock < 20) {
    colorClasses = "bg-yellow-100 text-yellow-800";
    text = "Poco Stock";
  }

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}
    >
      {text}
    </span>
  );
}

interface Props {
  data: Medication[];
  onSelect: (med: Medication) => void;
  onDelete: (id: string) => void;
}

export default function MedicationTable({ data, onSelect, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No se encontraron registros.
              </td>
            </tr>
          )}
          {data.map((med) => (
            <tr key={med.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{med.nombre}</div>
                <div className="text-sm text-gray-500">{med.presentacion}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {med.tipo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {med.cantidadDisponible}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusPill stock={med.cantidadDisponible} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onSelect(med)}
                  className="text-blue-600 hover:text-blue-800 bg-blue-100 px-3 py-1 rounded-md"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(med.id)}
                  className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md"
                >
                  Eliminar
                </button>
                {/* Aquí añadiremos el botón "Ajustar Stock" para la UT-09 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
