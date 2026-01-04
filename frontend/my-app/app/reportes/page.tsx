"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useState } from "react";
import NurseList from "./components/NurseList";
import EvaluationForm from "./components/EvaluationForm";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// --- Interfaces ---
export interface Nurse {
  id: string;
  nombre: string;
  departamento: string;
  turno: string;
}

export interface Evaluation {
  id: string;
  nurseId: string;
  date: string;
  score: number;
  observations: string;
}

// --- Mocks ---
const MOCK_NURSES: Nurse[] = [
  { id: "e1", nombre: "Beatriz López", departamento: "Urgencias", turno: "Matutino" },
  { id: "e2", nombre: "Carlos Méndez", departamento: "Cuidados Intensivos", turno: "Vespertino" },
  { id: "e3", nombre: "Diana Ruiz", departamento: "Pediatría", turno: "Nocturno" },
];

export default function EvaluacionesPage() {
  const [nurses] = useState<Nurse[]>(MOCK_NURSES);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  // Aquí guardaríamos el historial de evaluaciones (simulado)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Lógica PA-01: Registro Exitoso
  const handleSaveEvaluation = (evalData: Omit<Evaluation, "id" | "nurseId">) => {
    if (!selectedNurse) return;

    const newEvaluation: Evaluation = {
      id: crypto.randomUUID(),
      nurseId: selectedNurse.id,
      ...evalData,
    };

    // Guardamos en el estado (simulación de backend)
    setEvaluations((prev) => [newEvaluation, ...prev]);

    // Feedback visual (PA-01)
    MySwal.fire({
      title: "¡Evaluación Registrada!",
      text: `Se ha registrado el desempeño para ${selectedNurse.nombre} con éxito.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    
    // Opcional: Aquí podrías limpiar la selección si quisieras
    // setSelectedNurse(null); 
  };

  return (
    <LayoutDashboard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel Izquierdo: Selección de Personal */}
        <div className="md:col-span-1 bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Seleccionar Enfermero
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona al personal para registrar una nueva evaluación.
          </p>
          <NurseList 
            nurses={nurses} 
            selectedId={selectedNurse?.id || null} 
            onSelect={setSelectedNurse} 
          />
        </div>

        {/* Panel Derecho: Formulario de Evaluación */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Registrar Evaluación de Desempeño
          </h2>
          
          {selectedNurse ? (
            <div className="animate-fade-in-down">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-700">
                  Evaluando a: <span className="font-bold">{selectedNurse.nombre}</span>
                </p>
                <p className="text-xs text-blue-600">
                  {selectedNurse.departamento} - {selectedNurse.turno}
                </p>
              </div>
              
              <EvaluationForm 
                onSave={handleSaveEvaluation} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <p>Selecciona un enfermero del menú izquierdo para comenzar.</p>
            </div>
          )}
        </div>

      </div>
    </LayoutDashboard>
  );
}
