"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { FormEvent, useState } from "react";
import PatientHeader from "./components/PatientHeader";
import VitalSignsForm from "./components/VitalSignsForm";
import EvolutionNotes from "./components/EvolutionNotes";
import MedicationAdministration from "./components/MedicationAdministration";
import TabButton from "./components/TabButton";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Componente React
const MySwal = withReactContent(Swal);

// Funciones de validación
const validateNumericRange = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  if (value.trim() === '') return `${fieldName} no puede estar vacío.`;
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} debe ser un número.`;
  if (num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}.`;
  }
  return null;
};

const validateBloodPressure = (bp: string): string | null => {
  if (bp.trim() === '') return 'Presión Arterial no puede estar vacía.';
  
  const regex = /^[1-9][0-9]{1,2}\/[1-9][0-9]{1,2}$/;
  if (!regex.test(bp)) {
    return 'Formato inválido. Use "sistólica/diastólica", ej: 120/80';
  }
  
  // ¡Validación de Rango!
  const parts = bp.split('/');
  const sistolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

  if (sistolic < 70 || sistolic > 250) {
    return `Sistólica (${sistolic}) fuera de rango (70-250).`;
  }
  if (diastolic < 40 || diastolic > 140) {
    return `Diastólica (${diastolic}) fuera de rango (40-140).`;
  }
  if (sistolic <= diastolic) {
    return 'Sistólica debe ser mayor que la diastólica.';
  }
  
  return null;
};

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

type TabName = "signos" | "notas" | "medicamentos";

export default function PatientClinicalRecordPage() {
  const [originalVitals, setOriginalVitals] = useState<VitalSigns>(MOCK_VITALS);
  const [currentVitals, setCurrentVitals] = useState<VitalSigns>(MOCK_VITALS);
  const [newNoteText, setNewNoteText] = useState("");
  const [pastNotes, setPastNotes] = useState<Note[]>(MOCK_NOTES);
  const [errors, setErrors] = useState<{ vitalSigns?: any; note?: string }>({});
  const [activeTab, setActiveTab] = useState<TabName>("signos");

  // --- LÓGICA DE GUARDADO (MODIFICADA) ---
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { vitalSigns?: any; note?: string } = { vitalSigns: {} };

    let vitalsChanged = JSON.stringify(originalVitals) !== JSON.stringify(currentVitals);
    let noteChanged = newNoteText.trim() !== "";
    let changesToSave = false;

    // --- 1. VALIDACIÓN CONDICIONAL POR PESTAÑA ---
    if (activeTab === "signos") {
      // --- VALIDACIÓN DE RANGOS MÍN/MÁX AL GUARDAR ---

      // Validar Presión Arterial (Formato)
      const bpError = validateBloodPressure(currentVitals.bloodPressure);
      if (bpError) newErrors.vitalSigns.bloodPressure = bpError;

      // Validar Frecuencia Cardíaca (Rango lógico)
      const hrError = validateNumericRange(currentVitals.heartRate, 30, 220, "Frecuencia Cardíaca");
      if (hrError) newErrors.vitalSigns.heartRate = hrError;

      // Validar Temperatura (Rango lógico)
      const tempError = validateNumericRange(currentVitals.temperature, 34.0, 42.0, "Temperatura");
      if (tempError) newErrors.vitalSigns.temperature = tempError;

      // Validar Saturación
      const satError = validateNumericRange(currentVitals.oxygenSaturation, 80, 100, "Saturación O₂");
      if (satError) newErrors.vitalSigns.saturation = satError; // Corregí el nombre de la key
      
      // --- NUEVAS VALIDACIONES ---
      // Validar Glucosa
      const glucError = validateNumericRange(currentVitals.glucose, 50, 600, "Glucosa");
      if (glucError) newErrors.vitalSigns.glucose = glucError;

      // Validar Evacuaciones
      const evacError = validateNumericRange(currentVitals.evacuations, 0, 20, "Evacuaciones");
      if (evacError) newErrors.vitalSigns.evacuations = evacError;

      // Validar Orina
      const urineError = validateNumericRange(currentVitals.urineMl, 0, 5000, "Orina (ml)");
      if (urineError) newErrors.vitalSigns.urineMl = urineError;

    } else if (activeTab === "notas") {
      // Si estoy en la pestaña de Notas, valido notas
      // (Nuestra validación original era si la nota estaba vacía Y no había otros cambios)
      // (Pero ahora solo nos importa si la nota cambió)
      if (noteChanged && newNoteText.trim() === "") {
        newErrors.note = "La nota no puede estar vacía si se intenta añadir.";
      }

    } else if (activeTab === "medicamentos") {
      // Si estoy en la pestaña Medicamentos, este botón no hace nada.
      // El guardado es "instantáneo" con los botones de esa pestaña.
      console.log("El botón 'Guardar Cambios' no aplica a la pestaña de Medicamentos.");
      return;
    }

    // --- 2. MOSTRAR ERRORES (SI LOS HAY EN LA PESTAÑA ACTIVA) ---
    if (Object.keys(newErrors.vitalSigns).length > 0 || newErrors.note) {
      setErrors(newErrors);

      // Construye una lista de errores para el modal
      const errorMessages = [
        ...Object.values(newErrors.vitalSigns),
        ...(newErrors.note ? [newErrors.note] : [])
      ];

      MySwal.fire({
        title: "Error de Validación",
        html: `
          <p class="mb-2">Por favor, revisa los siguientes errores:</p>
          <ul class="text-left list-disc list-inside">
            ${errorMessages.map(err => `<li>${err}</li>`).join('')}
          </ul>
        `,
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // --- 3. PA-03: Verificación de "Sin Cambios" (POR PESTAÑA) ---
    if (activeTab === "signos" && !vitalsChanged) {
      MySwal.fire({
        title: "Sin Cambios",
        text: "No se detectaron cambios para guardar en Signos Vitalales.",
        icon: "info",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    if (activeTab === "notas" && !noteChanged) {
      MySwal.fire({
        title: "Sin Cambios",
        text: "No se detectaron cambios para guardar en Notas.",
        icon: "info",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // --- 4. PA-01: Guardado Exitoso (POR PESTAÑA) ---
    console.log(`Guardando datos de la pestaña: ${activeTab}`);

    if (activeTab === "signos" && vitalsChanged) {
      setOriginalVitals(currentVitals);
      changesToSave = true;
    }

    if (activeTab === "notas" && noteChanged) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        text: newNoteText.trim(),
        nurseName: CURRENT_NURSE_NAME,
        timestamp: new Date().toISOString(),
      };
      setPastNotes((prev) => [newNote, ...prev]);
      setNewNoteText(""); // Limpia el textarea
      changesToSave = true;
    }

    if (changesToSave) {
      MySwal.fire({
        title: "¡Éxito!",
        text: "Registro actualizado con éxito.",
        icon: "success",
        timer: 1500, // Se cierra solo después de 1.5s
        showConfirmButton: false,
      });
    }
  };

  const handleCancel = () => {
    // El cancelar sí debe ser global
    setCurrentVitals(originalVitals);
    setNewNoteText("");
    setErrors({});
  };

  const handleUpdateNote = (id: string, newText: string) => {
    // La validación de texto vacío se hace en el hijo (EvolutionNotes)
    // pero la mantenemos aquí por si acaso.
    if (newText.trim() === "") {
      MySwal.fire({
        title: "Error",
        text: "La nota de evolución no puede estar vacía.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return; // No guardes
    }

    // Actualiza el estado
    setPastNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, text: newText.trim() } : note
      )
    );

    // Muestra éxito
    MySwal.fire({
      title: "¡Nota Actualizada!",
      text: "La nota se actualizó correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <LayoutDashboard>
      <PatientHeader patient={MOCK_PATIENT} />

      <form onSubmit={handleSave} className="space-y-6 mt-6">
        {/* --- BARRA DE NAVEGACIÓN (Sin cambios) --- */}
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
        </div>

        {/* --- CONTENIDO DE LAS PESTAÑAS (Sin cambios) --- */}
        <div className="bg-white rounded-xl shadow p-6">
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
            </div>
          )}

          {activeTab === "notas" && (
            <EvolutionNotes
              pastNotes={pastNotes}
              newNote={newNoteText}
              onNewNoteChange={setNewNoteText}
              onEditNote={handleUpdateNote}
              error={errors.note}
            />
          )}

          {activeTab === "medicamentos" && (
            <MedicationAdministration
              patientId={MOCK_PATIENT.id}
              nurseName={CURRENT_NURSE_NAME}
            />
          )}
        </div>

        {/* --- BOTONES DE ACCIÓN (Sin cambios en el HTML) --- */}
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
