"use client";

import { useEffect, useState } from "react";
import { HistorialRecord } from "../page";

type Props = {
  value: HistorialRecord | null;
  onSave: (r: HistorialRecord) => void;
  onCancel: () => void;
};

export default function HistorialForm({ value, onSave, onCancel }: Props) {
  const empty: HistorialRecord = value || {
    id: "",
    patientFullName: "",
    patientCurp: "",
    patientSex: "",
    patientAge: "",
    patientArea: "",
    patientBed: "",
    patientNurse: "",
    reasonForAdmission: "",
    initialDiagnosis: "",
    vitals: { temperature: "", heartRate: "", bloodPressure: "", respiratoryRate: "", spo2: "" },
    medicalHistory: "",
    allergies: "",
    priorTreatments: "",
    notes: "",
    evolutionNotes: "",
    datetime: new Date().toISOString(),
    professional: "",
    status: "observacion",
    dischargeDate: undefined,
    dischargeReason: undefined,
    destination: undefined,
    authorizingDoctor: "",
    finalDiagnosis: "",
    type: "",
  };

  const [form, setForm] = useState<HistorialRecord>(empty);

  useEffect(() => {
    if (value) setForm(value);
  }, [value]);

  const set = <K extends keyof HistorialRecord>(k: K, v: HistorialRecord[K]) => setForm((s) => ({ ...s, [k]: v }));

  const setVital = (k: keyof NonNullable<HistorialRecord["vitals"]>, v: string) =>
    set("vitals", { ...(form.vitals || {}), [k]: v } as any);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-4">
        <section>
          <h3 className="font-semibold">Datos generales del paciente</h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-sm text-gray-600">Nombre completo</label>
              <input value={form.patientFullName} onChange={(e) => set("patientFullName", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">CURP</label>
              <input value={form.patientCurp} onChange={(e) => set("patientCurp", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Sexo</label>
              <input value={form.patientSex} onChange={(e) => set("patientSex", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Edad</label>
              <input value={String(form.patientAge ?? "")} onChange={(e) => set("patientAge", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Área / Servicio</label>
              <input value={form.patientArea} onChange={(e) => set("patientArea", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Cama / Cuarto</label>
              <input value={form.patientBed} onChange={(e) => set("patientBed", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600">Enfermero(a) responsable</label>
              <input value={form.patientNurse} onChange={(e) => set("patientNurse", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-semibold">Datos médicos principales</h3>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <div>
              <label className="block text-sm text-gray-600">Motivo de ingreso</label>
              <input value={form.reasonForAdmission} onChange={(e) => set("reasonForAdmission", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Diagnóstico inicial</label>
              <input value={form.initialDiagnosis} onChange={(e) => set("initialDiagnosis", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Signos vitales iniciales</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input placeholder="Temperatura" value={form.vitals?.temperature || ""} onChange={(e) => setVital("temperature", e.target.value)} className="w-full border rounded px-3 py-2" />
                <input placeholder="Frecuencia cardíaca" value={form.vitals?.heartRate || ""} onChange={(e) => setVital("heartRate", e.target.value)} className="w-full border rounded px-3 py-2" />
                <input placeholder="Presión arterial" value={form.vitals?.bloodPressure || ""} onChange={(e) => setVital("bloodPressure", e.target.value)} className="w-full border rounded px-3 py-2" />
                <input placeholder="Frecuencia respiratoria" value={form.vitals?.respiratoryRate || ""} onChange={(e) => setVital("respiratoryRate", e.target.value)} className="w-full border rounded px-3 py-2" />
                <input placeholder="Saturación de oxígeno" value={form.vitals?.spo2 || ""} onChange={(e) => setVital("spo2", e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Antecedentes médicos relevantes</label>
              <textarea value={form.medicalHistory} onChange={(e) => set("medicalHistory", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Alergias</label>
              <input value={form.allergies} onChange={(e) => set("allergies", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Tratamientos previos o actuales</label>
              <textarea value={form.priorTreatments} onChange={(e) => set("priorTreatments", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Notas médicas</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-semibold">Evolución y datos del registro</h3>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <div>
              <label className="block text-sm text-gray-600">Fecha y hora del registro</label>
              <input type="datetime-local" value={form.datetime?.slice(0, 16) || ""} onChange={(e) => set("datetime", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Profesional responsable</label>
              <input value={form.professional} onChange={(e) => set("professional", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Estado del paciente</label>
              <input value={form.status as string} onChange={(e) => set("status", e.target.value as any)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Notas de evolución</label>
              <textarea value={form.evolutionNotes} onChange={(e) => set("evolutionNotes", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Fecha de alta / traslado</label>
              <input type="datetime-local" value={form.dischargeDate || ""} onChange={(e) => set("dischargeDate", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Motivo de alta / destino</label>
              <input value={form.dischargeReason || ""} onChange={(e) => set("dischargeReason", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Destino (si aplica traslado)</label>
              <input value={form.destination || ""} onChange={(e) => set("destination", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Médico que autoriza</label>
              <input value={form.authorizingDoctor || ""} onChange={(e) => set("authorizingDoctor", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Diagnóstico final</label>
              <input value={form.finalDiagnosis || ""} onChange={(e) => set("finalDiagnosis", e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
