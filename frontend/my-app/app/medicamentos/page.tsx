"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import { useMemo, useState } from "react";
import MedicationSearchBar from "./components/MedicationSearchBar";
import MedicationTable from "./components/MedicationTable";
import MedicationForm from "./components/MedicationForm";

// 1. Interfaz basada en las clases Medicamento/Insumo [cite: 31-35, 56-61]
export type MedicationType = "Medicamento" | "Insumo";

export interface Medication {
  id: string;
  nombre: string;
  presentacion: string; // ej: "500mg", "Botella 1L"
  tipo: MedicationType;
  cantidadDisponible: number;
  dosisRecomendada?: string; // Opcional [cite: 34]
}

// 2. Mock de datos
const MOCK_MEDICATIONS: Medication[] = [
  {
    id: "m1",
    nombre: "Paracetamol",
    presentacion: "Tableta 500mg",
    tipo: "Medicamento",
    cantidadDisponible: 150,
  },
  {
    id: "m2",
    nombre: "Ibuprofeno",
    presentacion: "Tableta 200mg",
    tipo: "Medicamento",
    cantidadDisponible: 80,
  },
  {
    id: "i1",
    nombre: "Gasas Estériles",
    presentacion: "Paquete 10x10cm",
    tipo: "Insumo",
    cantidadDisponible: 30,
  },
  {
    id: "m3",
    nombre: "Amoxicilina",
    presentacion: "Suspensión 250mg/5ml",
    tipo: "Medicamento",
    cantidadDisponible: 0,
  },
];

// 3. Plantilla para un nuevo item
const NEW_MEDICATION_TEMPLATE: Medication = {
  id: "",
  nombre: "",
  presentacion: "",
  tipo: "Medicamento",
  cantidadDisponible: 0,
};

export default function MedicamentosPage() {
  const [medications, setMedications] =
    useState<Medication[]>(MOCK_MEDICATIONS);
  const [selected, setSelected] = useState<Medication | null>(null);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("Todos");

  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      const byText =
        q.trim() === "" ||
        m.nombre.toLowerCase().includes(q.toLowerCase()) ||
        m.presentacion.toLowerCase().includes(q.toLowerCase());
      const byType = tipo === "Todos" || m.tipo === tipo;
      return byText && byType;
    });
  }, [medications, q, tipo]);

  const handleSave = (data: Medication) => {
    setMedications((prev) => {
      const exists = prev.some((x) => x.id === data.id);
      if (exists) {
        return prev.map((x) => (x.id === data.id ? data : x));
      }
      return [{ ...data, id: crypto.randomUUID() }, ...prev];
    });
    setSelected(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este item?")) {
      setMedications((prev) => prev.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <LayoutDashboard>
      <div className="grid grid-cols-3 gap-6">
        {/* Panel izquierdo: lista */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Inventario de Farmacia
            </h2>
            <button
              onClick={() => setSelected(NEW_MEDICATION_TEMPLATE)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Registrar Item
            </button>
          </div>

          <MedicationSearchBar q={q} onQ={setQ} tipo={tipo} onTipo={setTipo} />

          <MedicationTable
            data={filteredMeds}
            onSelect={(m: Medication) => setSelected(m)}
            onDelete={handleDelete}
          />
        </div>

        {/* Panel derecho: formulario */}
        <div className="col-span-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Registro / Edición de Item
          </h2>
          <MedicationForm
            key={selected?.id}
            value={selected}
            onCancel={() => setSelected(null)}
            onSave={handleSave}          
          />
        </div>
      </div>
    </LayoutDashboard>
  );
}
