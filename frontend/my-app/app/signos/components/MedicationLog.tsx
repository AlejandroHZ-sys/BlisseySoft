"use client";
import { useState } from "react";
import Input from "@/components/Input";

interface Props {
  nurseName: string;
}

export default function MedicationLog({ nurseName }: Props) {
  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");

  const handleLogMed = () => {
    if (medication.trim() === "" || dose.trim() === "") {
      alert("Debe especificar el medicamento y la dosis.");
      return;
    }
    // Simulación de guardado
    alert(
      `Medicamento registrado:\n- ${medication} (${dose})\n- Administrado por: ${nurseName}`
    );
    setMedication("");
    setDose("");
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Input
          label="Medicamento"
          name="medication"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Input
          label="Dosis"
          name="dose"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={handleLogMed}
        className="h-10 px-4 py-2 bg-gray-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-gray-700"
      >
        Registrar
      </button>
    </div>
  );
}
