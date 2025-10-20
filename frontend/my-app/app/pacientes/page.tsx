"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useMemo, useState } from "react";
import PatientSearchBar from "./components/PatientSearchBar";
import PatientTable from "./components/PatientTable";
import type { Patient } from "./components/PatientTable";
import PatientForm from "./components/PatientForm";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    fullName: "Carlos Ortega",
    curp: "OECC990212HDF",
    area: "Urgencias",
    bed: "U-03",
    sex: "M",
    status: "Activo",
    nurse: "María Fernández",
  },
  {
    id: "p2",
    fullName: "Ana López",
    curp: "LOAA010101MDF",
    area: "UCI",
    bed: "C-04",
    sex: "F",
    status: "Observación",
    nurse: "Luis García",
  },
  {
    id: "p3",
    fullName: "Jorge Martínez",
    curp: "MAJJ980501HDF",
    area: "Cirugía",
    bed: "Q-12",
    sex: "M",
    status: "Alta",
    nurse: "—",
  },
];

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("");
  const [estado, setEstado] = useState<string>("");

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const byText =
        q.trim() === "" ||
        p.fullName.toLowerCase().includes(q.toLowerCase()) ||
        p.curp.toLowerCase().includes(q.toLowerCase()) ||
        p.bed.toLowerCase().includes(q.toLowerCase());
      const byArea = area === "" || area === "Todos" || p.area === area;
      const byEstado = estado === "" || estado === "Todos" || p.status === estado;
      return byText && byArea && byEstado;
    });
  }, [patients, q, area, estado]);

  const handleSave = (data: Patient) => {
    setPatients((prev) => {
      const exists = prev.some((x) => x.id === data.id);
      if (exists) {
        return prev.map((x) => (x.id === data.id ? data : x));
      }
      return [{ ...data, id: crypto.randomUUID() }, ...prev];
    });
    setSelected(null);
  };

  const handleDelete = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <LayoutDashboard>
      <div className="grid grid-cols-3 gap-6">
        {/* Panel izquierdo: lista */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Lista General de Pacientes
            </h2>
            <button
              onClick={() =>
                setSelected({
                  id: "",
                  fullName: "",
                  curp: "",
                  area: "Urgencias",
                  bed: "",
                  sex: "",
                  status: "Activo",
                  nurse: "",
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Registrar Paciente
            </button>
          </div>

          <PatientSearchBar
            q={q}
            onQ={setQ}
            area={area}
            onArea={setArea}
            estado={estado}
            onEstado={setEstado}
          />

          <PatientTable
            data={filtered}
            onSelect={(p: Patient) => setSelected(p)}
            onDelete={handleDelete}
          />
        </div>

        {/* Panel derecho: formulario */}
        <div className="col-span-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Registro / Edición de Paciente
          </h2>
          <PatientForm
            value={selected}
            onCancel={() => setSelected(null)}
            onSave={handleSave}
          />
        </div>
      </div>
    </LayoutDashboard>
  );
}
