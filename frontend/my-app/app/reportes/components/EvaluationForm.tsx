"use client";

import { useState, FormEvent } from "react";
import Input from "@/components/Input";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface EvaluationData {
  date: string;
  score: number;
  observations: string;
}

interface Props {
  onSave: (data: EvaluationData) => void;
}

export default function EvaluationForm({ onSave }: Props) {
  // Inicializamos la fecha con el día de hoy
  const today = new Date().toISOString().split('T')[0];
  
  const [date, setDate] = useState(today);
  const [score, setScore] = useState("");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // PA-02: Validación de Puntaje Obligatorio y Numérico
    if (score.trim() === "" || isNaN(parseFloat(score))) {
      MySwal.fire({
        title: "Error de Validación",
        text: "El puntaje es obligatorio y debe ser un valor numérico.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    const numericScore = parseFloat(score);

    // Validación extra de rango (Buena práctica de UX)
    if (numericScore < 0 || numericScore > 100) {
      MySwal.fire({
        title: "Puntaje fuera de rango",
        text: "El puntaje debe estar entre 0 y 100.",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // PA-03: Observaciones son opcionales (se envían aunque estén vacías)
    onSave({
      date,
      score: numericScore,
      observations: observations.trim(),
    });

    // Limpiar formulario tras guardar
    setScore("");
    setObservations("");
    setDate(today);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           {/* Input nativo de fecha para asegurar formato */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Evaluación
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <Input 
            label="Puntaje (0 - 100)"
            name="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Ej: 95.5"
            // type="number" // Podríamos forzarlo aquí, pero la validación manual es más segura para el PA-02
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones y Comentarios
        </label>
        <textarea
          rows={5}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describa el desempeño, logros o áreas de mejora..."
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          Opcional (PA-03)
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          Registrar Evaluación
        </button>
      </div>
    </form>
  );
}
