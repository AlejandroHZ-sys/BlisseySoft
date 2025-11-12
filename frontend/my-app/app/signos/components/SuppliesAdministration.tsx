"use client";

import { useState } from "react";
import Input from "@/components/Input";

// 1. IMPORTAMOS SWEETALERT
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// 2. INICIALIZAMOS MySwal
const MySwal = withReactContent(Swal);

// --- Interfaces (Actualizadas para Insumos) ---
interface Insumo {
  id: string;
  nombre: string;
  descripcion: string; // ANTES: presentacion
}

interface UsoInsumo { // ANTES: Suministro
  id: string;
  insumoId: string;     // ANTES: medicationId
  insumoName: string;   // ANTES: medicationName
  cantidad: string;     // ANTES: dose
  timestamp: string;
  nurseName: string;
}

interface EditFormData {
  insumoId: string;     // ANTES: medicationId
  cantidad: string;     // ANTES: dose
}

interface Props {
  patientId: string;
  nurseName: string;
}

// --- Mocks (Actualizados para Insumos) ---
const MOCK_INSUMOS: Insumo[] = [ // ANTES: MOCK_MEDICATIONS
  { id: "i1", nombre: "Guantes de látex", descripcion: "Caja (100 unidades)" },
  { id: "i2", nombre: "Jeringa", descripcion: "5ml" },
  { id: "i3", nombre: "Gasa estéril", descripcion: "Paquete 10x10cm" },
  { id: "i4", nombre: "Solución salina", descripcion: "Bolsa 500ml" },
];

// ANTES: MedicationAdministration
export default function AdministracionInsumos({ patientId, nurseName }: Props) {
  const [history, setHistory] = useState<UsoInsumo[]>([]); // ANTES: Suministro
  const [newSelectedInsumo, setNewSelectedInsumo] = useState<string>(""); // ANTES: newSelectedMed
  const [newCantidad, setNewCantidad] = useState(""); // ANTES: newDose
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    insumoId: "",     // ANTES: medicationId
    cantidad: "",     // ANTES: dose
  });

  // 3. Estados de error (Sin cambios, ya estaban comentados)

  // --- Lógica de Registro (Actualizada con Alertas) ---
  const handleRegisterSupply = () => {
    // PA-03 (UT-07)
    if (newSelectedInsumo === "") { // ANTES: newSelectedMed
      MySwal.fire({
        title: "Error",
        text: "Debe seleccionar un insumo.", // ANTES: medicamento
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    // PA-02 (UT-07)
    if (newCantidad.trim() === "") { // ANTES: newDose
      MySwal.fire({
        title: "Error",
        text: "El campo 'cantidad usada' es obligatorio.", // ANTES: 'dosis'
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    // ANTES: medication, MOCK_MEDICATIONS
    const insumo = MOCK_INSUMOS.find((i) => i.id === newSelectedInsumo); 
    if (!insumo) { // ANTES: medication
      MySwal.fire({
        title: "Error",
        text: "Insumo no encontrado.", // ANTES: Medicamento
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // PA-01 (UT-07)
    const newUsoInsumo: UsoInsumo = { // ANTES: newSuministro
      id: crypto.randomUUID(),
      insumoId: newSelectedInsumo, // ANTES: medicationId
      insumoName: `${insumo.nombre} (${insumo.descripcion})`, // ANTES: medicationName
      cantidad: newCantidad, // ANTES: dose
      timestamp: new Date().toISOString(),
      nurseName: nurseName,
    };
    setHistory([newUsoInsumo, ...history]); // ANTES: newSuministro
    setNewSelectedInsumo(""); // ANTES: setNewSelectedMed
    setNewCantidad(""); // ANTES: setNewDose

    // Alerta de Éxito
    MySwal.fire({
      title: "¡Éxito!",
      text: "Uso de insumo registrado correctamente.", // ANTES: Suministro
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleEditClick = (uso: UsoInsumo) => { // ANTES: suministro: Suministro
    setEditingId(uso.id);
    setEditFormData({
      insumoId: uso.insumoId,     // ANTES: medicationId
      cantidad: uso.cantidad,     // ANTES: dose
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
    if (editFormData.cantidad.trim() === "") { // ANTES: dose
      MySwal.fire({
        title: "Error",
        text: "La cantidad no puede estar vacía.", // ANTES: dosis
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    // ANTES: updatedMed, MOCK_MEDICATIONS
    const updatedInsumo = MOCK_INSUMOS.find( 
      (m) => m.id === editFormData.insumoId // ANTES: medicationId
    );
    if (!updatedInsumo) { // ANTES: updatedMed
      MySwal.fire({
        title: "Error",
        text: "Insumo no válido.", // ANTES: Medicamento
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
              cantidad: editFormData.cantidad, // ANTES: dose
              insumoId: editFormData.insumoId, // ANTES: medicationId
              insumoName: `${updatedInsumo.nombre} (${updatedInsumo.descripcion})`, // ANTES: medicationName
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
        Registrar Uso de Insumo {/* ANTES: Suministro de Medicamento */}
      </h2>

      {/* Formulario de Registro (Actualizado) */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="new_insumo" className="block text-sm font-medium text-gray-700 mb-1">
            Insumo Usado {/* ANTES: Medicamento */}
          </label>
          <select
            id="new_insumo" // ANTES: new_medication
            name="new_insumo" // ANTES: new_medication
            value={newSelectedInsumo} // ANTES: newSelectedMed
            onChange={(e) => setNewSelectedInsumo(e.target.value)} // ANTES: setNewSelectedMed
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Seleccionar --</option>
            {MOCK_INSUMOS.map((insumo) => ( // ANTES: MOCK_MEDICATIONS
              <option key={insumo.id} value={insumo.id}>
                {/* ANTES: med.nombre (med.presentacion) */}
                {insumo.nombre} ({insumo.descripcion}) 
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <Input
            label="Cantidad Usada" // ANTES: Dosis
            name="new_cantidad" // ANTES: new_dose
            value={newCantidad} // ANTES: newDose
            onChange={(e) => setNewCantidad(e.target.value)} // ANTES: setNewDose
            placeholder="Ej: 5 unidades" // ANTES: Ej: 1 tableta
          />
        </div>

        <button
          type="button"
          onClick={handleRegisterSupply}
          className="h-10 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          Registrar Uso {/* ANTES: Registrar Suministro */}
        </button>
      </div>

      {/* 4. Errores de texto (Sin cambios, ya comentados) */}


      {/* --- TABLA DE HISTORIAL (Actualizada) --- */}
      <div className="space-y-3 pt-4">
        <h3 className="text-md font-semibold text-gray-600">
          Historial de Usos (Paciente: {patientId}) {/* ANTES: Suministros */}
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay insumos registrados para este paciente. {/* ANTES: medicamentos */}
          </p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Insumo Usado</th> {/* ANTES: Medicamento */}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad Usada</th> {/* ANTES: Dosis */}
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
                            name="insumoId" // ANTES: medicationId
                            value={editFormData.insumoId} // ANTES: medicationId
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            {MOCK_INSUMOS.map((insumo) => ( // ANTES: MOCK_MEDICATIONS
                              <option key={insumo.id} value={insumo.id}>
                                {/* ANTES: med.nombre (med.presentacion) */}
                                {insumo.nombre} ({insumo.descripcion})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            name="cantidad" // ANTES: dose
                            value={editFormData.cantidad} // ANTES: dose
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
                        {/* ANTES: medicationName */}
                        <td className="px-4 py-3 text-sm text-gray-900">{item.insumoName}</td> 
                        {/* ANTES: dose */}
                        <td className="px-4 py-3 text-sm text-gray-700">{item.cantidad}</td> 
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
