"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useEffect, useMemo, useState } from "react";
import PatientSearchBar from "./components/PatientSearchBar";
import PatientTable from "./components/PatientTable";
import PatientForm from "./components/PatientForm";
import { usePacientesStore, type Patient } from "@/lib/patientsStore";

export default function PacientesPage() {
  const {
    pacientes,
    loading,
    error,
    fetchPacientes,
    addPaciente,
    editPaciente,
    removePaciente,
  } = usePacientesStore();

  const [selected, setSelected] = useState<Patient | null>(null);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("");
  const [estado, setEstado] = useState<string>("");

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const filtered = useMemo(() => {
    return pacientes.filter((p) => {
      const byText =
        q.trim() === "" ||
        p.fullName.toLowerCase().includes(q.toLowerCase()) ||
        p.curp.toLowerCase().includes(q.toLowerCase()) ||
        p.bed.toLowerCase().includes(q.toLowerCase());
      const byArea = area === "" || p.area === area;
      const byEstado = estado === "" || p.status === estado;
      return byText && byArea && byEstado;
    });
  }, [pacientes, q, area, estado]);

  const handleSave = async (data: Patient) => {
    if (!data.fullName.trim()) return alert("Nombre requerido");
    if (!data.area) return alert("Área requerida");
    if (!data.status) return alert("Estado requerido");

    if (data.id) {
      await editPaciente(data.id, data);
    } else {
      const { id: _omit, ...nuevo } = data;
      await addPaciente({ ...nuevo, nurse: nuevo.nurse || "—" });
    }
    setSelected(null);
  };

  const handleDelete = async (id: string | number) => {
    await removePaciente(id);
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
                  status: "Activo",
                  nurse: "",
                } as any)
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

          {loading && <p className="p-4 text-gray-500">Cargando pacientes...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}

          <PatientTable
            data={filtered}
            onSelect={setSelected}
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
