"use client";
import type { Patient } from "../page";

interface Props {
  patient: Patient;
}

export default function PatientHeader({ patient }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-bold text-gray-900">
        Registro Clínico de: {patient.fullName}
      </h1>
      <div className="flex gap-4 text-sm text-gray-600 mt-2">
        <span>
          <strong>Cama:</strong> {patient.bed}
        </span>
        <span>
          <strong>Área:</strong> {patient.area}
        </span>
      </div>
    </div>
  );
}
