"use client";

import { useEffect, useState } from "react";
import type { Patient, PatientStatus } from "./PatientTable";

const AREAS = ["Urgencias", "UCI", "Cirugía", "Pediatría", "Hospitalización"];
const TRIAGE = ["Rojo", "Naranja", "Amarillo", "Verde", "Azul"];
const ESTADOS: PatientStatus[] = ["Activo", "Observación", "Alta", "Traslado"];

// Simulación de catálogo de enfermeros activos
const NURSES = ["María Fernández", "Luis García", "Ana Sánchez", "—"];

type FormModel = Patient & {
  diagnosis?: string;
  triage?: string;
  birthDate?: string;
  admitDate?: string;
};

export default function PatientForm({
  value,
  onSave,
  onCancel,
}: {
  value: Patient | null;
  onSave: (p: Patient) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormModel | null>(null);

  useEffect(() => {
    if (value) {
      // value is a Patient (base type). Some fields used by the form are optional
      // and may not exist on Patient; cast to Partial<FormModel> to read them safely.
      const extra = value as Partial<FormModel>;
      setForm({
        ...value,
        diagnosis: extra.diagnosis ?? "",
        sex: extra.sex ?? "",
        triage: extra.triage ?? "Verde",
        birthDate: extra.birthDate ?? "",
        admitDate: extra.admitDate ?? new Date().toISOString().slice(0, 10),
      });
    } else {
      setForm(null);
    }
  }, [value]);

  if (!form) {
    return (
      <div className="text-sm text-gray-500">
        Selecciona un paciente de la lista o presiona “Registrar Paciente”.
      </div>
    );
  }

  const set = <K extends keyof FormModel>(k: K, v: FormModel[K]) =>
    setForm((prev) => (prev ? { ...prev, [k]: v } : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones mínimas
    if (!form.fullName.trim()) return alert("Nombre requerido");
    if (!form.area) return alert("Área requerida");
    if (!form.status) return alert("Estado requerido");

    const toSave: Patient = {
      id: form.id,
      fullName: form.fullName.trim(),
      curp: form.curp?.trim() ?? "",
      area: form.area,
      bed: form.bed?.trim() ?? "",
      sex: form.sex ?? "",
      status: form.status as PatientStatus,
      nurse: form.nurse ?? "",
    };
    onSave(toSave);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Datos personales */}
      <div className="grid grid-cols-2 gap-3">
        <input
          className="border rounded-lg p-2 col-span-2"
          placeholder="Nombre completo"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          required
        />
        <input
          className="border rounded-lg p-2"
          placeholder="CURP / ID"
          value={form.curp}
          onChange={(e) => set("curp", e.target.value)}
        />
        <select
          className="border rounded-lg p-2"
          value={form.sex ?? ""}
          onChange={(e) => set("sex", e.target.value)}
        >
          <option value="">Sexo</option>
          <option value="M">M</option>
          <option value="F">F</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          type="date"
          className="border rounded-lg p-2"
          value={form.birthDate}
          onChange={(e) => set("birthDate", e.target.value)}
          placeholder="Fecha de nacimiento"
        />
      </div>

      {/* Diagnóstico y triage */}
      <textarea
        className="border rounded-lg p-2"
        placeholder="Diagnóstico inicial"
        value={form.diagnosis}
        onChange={(e) => set("diagnosis", e.target.value)}
        rows={3}
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border rounded-lg p-2"
          value={form.triage}
          onChange={(e) => set("triage", e.target.value)}
        >
          {TRIAGE.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          type="date"
          className="border rounded-lg p-2"
          value={form.admitDate}
          onChange={(e) => set("admitDate", e.target.value)}
          placeholder="Fecha de ingreso"
        />
      </div>

      {/* Asignación */}
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border rounded-lg p-2"
          value={form.area}
          onChange={(e) => set("area", e.target.value)}
        >
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <input
          className="border rounded-lg p-2"
          placeholder="Cama / Cuarto (p. ej. U-03)"
          value={form.bed}
          onChange={(e) => set("bed", e.target.value)}
        />
        <select
          className="border rounded-lg p-2 col-span-2"
          value={form.nurse}
          onChange={(e) => set("nurse", e.target.value)}
        >
          {NURSES.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <select
        className="border rounded-lg p-2"
        value={form.status}
        onChange={(e) => set("status", e.target.value as PatientStatus)}
      >
        {ESTADOS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
