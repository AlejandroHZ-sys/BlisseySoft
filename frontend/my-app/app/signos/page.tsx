"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { FormEvent, useState } from "react"; // 'useEffect' ya no es necesario aquí
import PatientHeader from "./components/PatientHeader";
import VitalSignsForm from "./components/VitalSignsForm";
import EvolutionNotes from "./components/EvolutionNotes";
import MedicationLog from "./components/MedicationLog";
import TabButton from "./components/TabButton"; // Importamos el nuevo componente

// --- Tipos de Datos (Sin cambios) ---
export interface Patient {
  id: string;
  fullName: string;
  bed: string;
  area: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  glucose: string;
  evacuations: string;
  urineMl: string;
}

export interface Note {
  id: string;
  text: string;
  nurseName: string;
  timestamp: string;
}

// --- Mock de Datos (Sin cambios) ---
const MOCK_PATIENT: Patient = {
  id: "p1",
  fullName: "Carlos Ortega",
  bed: "U-03",
  area: "Urgencias",
};

const MOCK_VITALS: VitalSigns = {
  bloodPressure: "120/80",
  heartRate: "75",
  temperature: "36.5",
  oxygenSaturation: "98",
  glucose: "95",
  evacuations: "1",
  urineMl: "300",
};

const MOCK_NOTES: Note[] = [
  {
    id: "n1",
    text: "Paciente ingresa consciente y orientado.",
    nurseName: "Ana Sánchez",
    timestamp: "2025-10-22T08:00:00",
  },
];

const CURRENT_NURSE_NAME = "Enfermera B. López";

// Define los tipos para las pestañas
type TabName = "signos" | "notas" | "medicamentos";

export default function PatientClinicalRecordPage() {
  // --- Estados (Sin cambios en la lógica de datos) ---
  const [originalVitals, setOriginalVitals] = useState<VitalSigns>(MOCK_VITALS);
  const [currentVitals, setCurrentVitals] = useState<VitalSigns>(MOCK_VITALS);
  const [newNoteText, setNewNoteText] = useState("");
  const [pastNotes, setPastNotes] = useState<Note[]>(MOCK_NOTES);
  const [errors, setErrors] = useState<{ vitalSigns?: any; note?: string }>({});

  // --- NUEVO ESTADO PARA LAS PESTAÑAS ---
  const [activeTab, setActiveTab] = useState<TabName>("signos");

  // --- Lógica de Guardado (Sin cambios) ---
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { vitalSigns?: any; note?: string } = { vitalSigns: {} };

    // Validación
    const isNumeric = (value: string) => value.trim() === "" || !isNaN(Number(value));
    if (!isNumeric(currentVitals.heartRate)) {
      newErrors.vitalSigns.heartRate = "Debe ser un valor numérico.";
    }
    if (!isNumeric(currentVitals.glucose)) {
      newErrors.vitalSigns.glucose = "Debe ser un valor numérico.";
    }
    if (!isNumeric(currentVitals.evacuations)) {
      newErrors.vitalSigns.evacuations = "Debe ser un valor numérico.";
    }
    if (!isNumeric(currentVitals.urineMl)) {
      newErrors.vitalSigns.urineMl = "Debe ser un valor numérico.";
    }
    const vitalsChanged = JSON.stringify(originalVitals) !== JSON.stringify(currentVitals);
    if (newNoteText.trim() === "" && !vitalsChanged) {
       newErrors.note = "El campo Nota de Evolución es obligatorio si no hay otros cambios.";
    }
    if (Object.keys(newErrors.vitalSigns).length > 0 || newErrors.note) {
      setErrors(newErrors);
      alert("Error: Revisa los campos marcados en rojo.");
      return;
    }

    // PA-03
    const noChanges = !vitalsChanged && newNoteText.trim() === "";
    if (noChanges) {
      alert("No se detectaron cambios para guardar");
      return;
    }

    // PA-01
    console.log("Guardando datos...");
    setOriginalVitals(currentVitals);
    if (newNoteText.trim() !== "") {
      const newNote: Note = {
        id: crypto.randomUUID(),
        text: newNoteText.trim(),
        nurseName: CURRENT_NURSE_NAME,
        timestamp: new Date().toISOString(),
      };
      setPastNotes((prev) => [newNote, ...prev]);
      setNewNoteText("");
    }
    alert("Registro actualizado con éxito");
  };

  const handleCancel = () => {
    setCurrentVitals(originalVitals);
    setNewNoteText("");
    setErrors({});
  };

  return (
    <LayoutDashboard>
      {/* El encabezado del paciente se queda afuera */}
      <PatientHeader patient={MOCK_PATIENT} />

      {/* El formulario principal sigue envolviendo todo para el guardado unificado */}
      <form onSubmit={handleSave} className="space-y-6 mt-6">
        
        {/* --- BARRA DE NAVEGACIÓN DE PESTAÑAS --- */}
        <div className="flex border-b border-gray-200">
          <TabButton
            label="Signos Vitales"
            isActive={activeTab === "signos"}
            onClick={() => setActiveTab("signos")}
          />
          <TabButton
            label="Notas de Enfermería"
            isActive={activeTab === "notas"}
            onClick={() => setActiveTab("notas")}
          />
          <TabButton
            label="Medicamentos"
            isActive={activeTab === "medicamentos"}
            onClick={() => setActiveTab("medicamentos")}
          />
          {/* La cama del paciente ahora la muestra PatientHeader */}
        </div>

        {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
        <div className="bg-white rounded-xl shadow p-6">
          
          {/* Pestaña 1: Signos Vitales */}
          {activeTab === "signos" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Registrar Nuevos Signos Vitales
              </h2>
              <VitalSignsForm
                vitals={currentVitals}
                onChange={setCurrentVitals}
                errors={errors.vitalSigns}
              />
              {/* NOTA: La imagen muestra un "Histórico de Lecturas" aquí.
                Nuestra lógica actual no guarda un historial de signos vitales,
                solo de notas. Por ahora, esta pestaña solo contiene el formulario.
              */}
            </div>
          )}

          {/* Pestaña 2: Notas de Enfermería */}
          {activeTab === "notas" && (
            <EvolutionNotes
              pastNotes={pastNotes}
              newNote={newNoteText}
              onNewNoteChange={setNewNoteText}
              error={errors.note}
            />
            // Este componente ya tiene la estructura "Formulario + Historial"
          )}

          {/* Pestaña 3: Medicamentos */}
          {activeTab === "medicamentos" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Administración de Medicamentos
              </h2>
              <MedicationLog nurseName={CURRENT_NURSE_NAME} />
            </div>
          )}
        </div>

        {/* Botones de Acción (se quedan al final, fuera de las pestañas) */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </LayoutDashboard>
  );
}
