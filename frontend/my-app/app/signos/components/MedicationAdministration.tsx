"use client";

import { useState } from "react";
import Input from "@/components/Input";

// 1. IMPORTAMOS SWEETALERT
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// 2. INICIALIZAMOS MySwal
const MySwal = withReactContent(Swal);

// --- Interfaces (Sin cambios) ---
interface Medicamento {
  id: string;
  nombre: string;
  presentacion: string;
}

interface Suministro {
  id: string;
  medicationId: string;
  medicationName: string;
  dose: string;
  timestamp: string;
  nurseName: string;
}

interface EditFormData {
  medicationId: string;
  dose: string;
}

interface Props {
  patientId: string;
  nurseName: string;
}

// --- Mocks (Sin cambios) ---
const MOCK_MEDICATIONS: Medicamento[] = [
  { id: "m1", nombre: "Paracetamol", presentacion: "500mg" },
  { id: "m2", nombre: "Ibuprofeno", presentacion: "200mg" },
  { id: "m3", nombre: "Amoxicilina", presentacion: "250mg" },
  { id: "m4", nombre: "Losartán", presentacion: "50mg" },
];

export default function MedicationAdministration({ patientId, nurseName }: Props) {
  const [history, setHistory] = useState<Suministro[]>([]);
  const [newSelectedMed, setNewSelectedMed] = useState<string>("");
  const [newDose, setNewDose] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    medicationId: "",
    dose: "",
  });

  // 3. Ya no necesitamos los estados de error de texto
  // const [newError, setNewError] = useState<string | null>(null);
  // const [editError, setEditError] = useState<string | null>(null);

  // --- Lógica de Registro (Actualizada con Alertas) ---
  const handleRegisterSupply = () => {
    // PA-03 (UT-07)
    if (newSelectedMed === "") {
      MySwal.fire({
        title: "Error",
        text: "Debe seleccionar un medicamento.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    // PA-02 (UT-07)
    if (newDose.trim() === "") {
      MySwal.fire({
        title: "Error",
        text: "El campo 'dosis' es obligatorio.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    const medication = MOCK_MEDICATIONS.find((m) => m.id === newSelectedMed);
    if (!medication) {
      MySwal.fire({
        title: "Error",
        text: "Medicamento no encontrado.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // PA-01 (UT-07)
    const newSuministro: Suministro = {
      id: crypto.randomUUID(),
      medicationId: newSelectedMed,
      medicationName: `${medication.nombre} ${medication.presentacion}`,
      dose: newDose,
      timestamp: new Date().toISOString(),
      nurseName: nurseName,
    };
    setHistory([newSuministro, ...history]);
    setNewSelectedMed("");
    setNewDose("");

    // Alerta de Éxito
    MySwal.fire({
      title: "¡Éxito!",
      text: "Suministro registrado correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleEditClick = (suministro: Suministro) => {
    setEditingId(suministro.id);
    setEditFormData({
      medicationId: suministro.medicationId,
      dose: suministro.dose,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Lógica de Guardar Edición (Actualizada con Alertas) ---
  const handleSaveClick = (id: string) => {
    // PA-02 (UT-08)
    if (editFormData.dose.trim() === "") {
      MySwal.fire({
        title: "Error",
        text: "La dosis no puede estar vacía.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    const updatedMed = MOCK_MEDICATIONS.find(
      (m) => m.id === editFormData.medicationId
    );
    if (!updatedMed) {
      MySwal.fire({
        title: "Error",
        text: "Medicamento no válido.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // PA-01 & PA-04 (UT-08)
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              dose: editFormData.dose,
              medicationId: editFormData.medicationId,
              medicationName: `${updatedMed.nombre} ${updatedMed.presentacion}`,
            }
          : item
      )
    );
    setEditingId(null);

    // Alerta de Éxito
    MySwal.fire({
      title: "¡Actualizado!",
      text: "El registro se actualizó correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">
        Registrar Suministro de Medicamento
      </h2>

      {/* Formulario de Registro (Sin cambios) */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="new_medication" className="block text-sm font-medium text-gray-700 mb-1">
            Medicamento
          </label>
          <select
            id="new_medication"
            name="new_medication"
            value={newSelectedMed}
            onChange={(e) => setNewSelectedMed(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Seleccionar --</option>
            {MOCK_MEDICATIONS.map((med) => (
              <option key={med.id} value={med.id}>
                {med.nombre} ({med.presentacion})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <Input
            label="Dosis"
            name="new_dose"
            value={newDose}
            onChange={(e) => setNewDose(e.target.value)}
            placeholder="Ej: 1 tableta"
          />
        </div>

        <button
          type="button"
          onClick={handleRegisterSupply}
          className="h-10 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          Registrar Suministro
        </button>
      </div>

      {/* 4. Ya no necesitamos mostrar los errores de texto aquí */}
      {/* {newError && <p className="text-sm text-red-600 -mt-2">{newError}</p>} */}
      {/* {editError && <p className="text-sm text-red-600 -mt-2">{editError}</p>} */}


      {/* --- TABLA DE HISTORIAL (Sin cambios) --- */}
      <div className="space-y-3 pt-4">
        <h3 className="text-md font-semibold text-gray-600">
          Historial de Suministros (Paciente: {patientId})
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay medicamentos registrados para este paciente.
          </p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dosis</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registrado por</th>
                  <th className="px-4 py-2 text-left text-xs font-m
edium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id}>
                    {editingId === item.id ? (
                      // --- Fila en Modo Edición ---
                      <>
                        <td className="px-4 py-3">
                          <select
                            name="medicationId"
                            value={editFormData.medicationId}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            {MOCK_MEDICATIONS.map((med) => (
                              <option key={med.id} value={med.id}>
                                {med.nombre} ({med.presentacion})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            name="dose"
                            value={editFormData.dose}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.nurseName}
                        </td>
                        <td className="px-4 py-3 text-sm space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleSaveClick(item.id)}
                            className="text-green-600 hover:text-green-800 bg-green-100 px-3 py-1 rounded-md"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelClick}
                            className="text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded-md"
                            >
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      // --- Fila en Modo Lectura ---
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.medicationName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.dose}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{new Date(item.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.nurseName}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-100 px-3 py-1 rounded-md"
                          >
                            Editar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
