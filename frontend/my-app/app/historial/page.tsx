"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useMemo, useState, useEffect } from "react";
import HistorialFilters from "./components/HistorialFilters";
import HistorialTable from "./components/HistorialTable";
import HistorialForm from "./components/HistorialForm";

export type HistorialRecord = {
  id: string;
  // Patient general data
  patientFullName: string;
  patientCurp?: string;
  patientSex?: string;
  patientAge?: number | string;
  patientArea?: string;
  patientBed?: string;
  patientNurse?: string;

  // Medical main data
  reasonForAdmission?: string;
  initialDiagnosis?: string;
  vitals?: {
    temperature?: string; // e.g. "37.2 °C"
    heartRate?: string; // bpm
    bloodPressure?: string; // e.g. "120/80"
    respiratoryRate?: string; // rpm
    spo2?: string; // %
  };
  medicalHistory?: string;
  allergies?: string;
  priorTreatments?: string;
  notes?: string; // general notes / medical notes
  evolutionNotes?: string;

  // Record metadata
  datetime: string; // ISO date/time
  professional?: string;
  status?: "estable" | "critico" | "observacion" | "alta" | string;
  dischargeDate?: string;
  dischargeReason?: string;
  destination?: string; // if transferred
  authorizingDoctor?: string;
  finalDiagnosis?: string;

  // other
  type?: string; // entry type: Nota, Evolución, Interconsulta, etc.
};

const MOCK: HistorialRecord[] = [
  {
    id: "1",
    patientFullName: "Juan Pérez",
    patientCurp: "PEPJ800101HDFZRN01",
    patientSex: "Masculino",
    patientAge: 42,
    patientArea: "Urgencias",
    patientBed: "Cama 12",
    patientNurse: "Enf. López",
    reasonForAdmission: "Dolor torácico",
    initialDiagnosis: "Sospecha de angina",
    vitals: { temperature: "36.8 °C", heartRate: "88 bpm", bloodPressure: "130/85", respiratoryRate: "18 rpm", spo2: "97%" },
    medicalHistory: "Hipertensión arterial",
    allergies: "Ninguna conocida",
    priorTreatments: "AAS reciente",
    notes: "Paciente estable al ingreso, requiere observación.",
    evolutionNotes: "Respuesta favorable a analgesia",
    datetime: "2025-10-01T09:30:00",
    professional: "Dra. Ruiz",
    status: "observacion",
    dischargeDate: undefined,
    dischargeReason: undefined,
    destination: undefined,
    authorizingDoctor: "Dr. García",
    finalDiagnosis: "Angina de pecho",
    type: "Nota de enfermería",
  },
  {
    id: "2",
    patientFullName: "María López",
    patientCurp: "LOPM850505MDFRZ02",
    patientSex: "Femenino",
    patientAge: 38,
    patientArea: "Hospitalización",
    patientBed: "Habitación 204",
    patientNurse: "Enf. Martínez",
    reasonForAdmission: "Cirugía programada",
    initialDiagnosis: "Apendicitis aguda",
    vitals: { temperature: "37.1 °C", heartRate: "76 bpm", bloodPressure: "118/72", respiratoryRate: "16 rpm", spo2: "98%" },
    medicalHistory: "Sin comorbilidades relevantes",
    allergies: "Penicilina",
    priorTreatments: "Antibiótico preoperatorio",
    notes: "Postoperatorio sin complicaciones",
    evolutionNotes: "Alta hospitalaria prevista",
    datetime: "2025-10-03T14:15:00",
    professional: "Dr. Pérez",
    status: "estable",
    dischargeDate: "2025-10-06T10:00:00",
    dischargeReason: "Mejoría clínica",
    destination: "Domicilio",
    authorizingDoctor: "Dr. Pérez",
    finalDiagnosis: "Apendicitis aguda confirmada",
    type: "Evolución",
  },
];

export default function HistorialPage() {
  const [records, setRecords] = useState<HistorialRecord[]>(MOCK);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<HistorialRecord | null>(null);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const textSource = ((r.notes || r.evolutionNotes || r.reasonForAdmission || r.initialDiagnosis || r.patientFullName || r.patientNurse || r.professional) as string) || "";
      const byText = q.trim() === "" || textSource.toLowerCase().includes(q.toLowerCase());
      const byType = type === "" || type === "Todos" || r.type === type;
      return byText && byType;
    });
  }, [records, q, type]);

  const handleSave = (data: HistorialRecord) => {
    if (!data.id) {
      const nuevo = { ...data, id: String(Date.now()) };
      setRecords((s) => [nuevo, ...s]);
    } else {
      setRecords((s) => s.map((x) => (x.id === data.id ? data : x)));
    }
    setSelected(null);
  };

  const handleDelete = (id: string) => {
    setRecords((s) => s.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Persist records in localStorage so the detail page can load them
  useEffect(() => {
    try {
      const raw = localStorage.getItem("historial_records");
      if (raw) {
        const parsed = JSON.parse(raw) as HistorialRecord[];
        // Only set if there is something different (avoid overwriting with MOCK unnecessarily)
        if (Array.isArray(parsed) && parsed.length > 0) setRecords(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("historial_records", JSON.stringify(records));
    } catch (e) {
      // ignore quota errors
    }
  }, [records]);

  return (
    <LayoutDashboard>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Historial clínico</h2>
            <button
              onClick={() =>
                setSelected({
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
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Nuevo registro
            </button>
          </div>

          <HistorialFilters q={q} onQ={setQ} type={type} onType={setType} />

          <HistorialTable data={filtered} onSelect={setSelected} onDelete={handleDelete} />
        </div>

        <div className="col-span-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar / Editar registro</h2>
          <HistorialForm value={selected} onCancel={() => setSelected(null)} onSave={handleSave} />
        </div>
      </div>
    </LayoutDashboard>
  );
}
