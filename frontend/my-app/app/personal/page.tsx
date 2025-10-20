"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import NurseTable from "./components/NurseTable";
import NurseForm from "./components/NurseForm";

export default function GestionEnfermeros() {
  return (
    <LayoutDashboard>
      <div className="grid grid-cols-3 gap-6">
        {/* Lista de enfermeros */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Lista General de Enfermeros
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              + Registrar Enfermero
            </button>
          </div>
          <NurseTable />
        </div>

        {/* Formulario de registro/edición */}
        <div className="col-span-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Registro / Edición de Enfermero
          </h2>
          <NurseForm />
        </div>
      </div>
    </LayoutDashboard>
  );
}
