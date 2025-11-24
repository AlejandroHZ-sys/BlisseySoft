"use client";

import { useState } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import NurseTable from "./components/NurseTable";
import NurseForm from "./components/NurseForm";
import { useEnfermeros, type Enfermero } from "../context/EnfermerosContext";

export type Nurse = Enfermero;

export default function GestionEnfermeros() {
  const {
    enfermeros: nursesData,
    addEnfermero,
    updateEnfermero,
    deleteEnfermero,
  } = useEnfermeros();

  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNurse = (nurse: Nurse) => {
    addEnfermero(nurse);
    setSelectedNurse(null);
    setShowForm(false);
  };

  const handleUpdateNurse = (nurse: Nurse) => {
    updateEnfermero(nurse);
    setSelectedNurse(null);
    setShowForm(false);
  };

  const handleDeleteNurse = (id: string) => {
    deleteEnfermero(id);
    if (selectedNurse?.id === id) {
      setSelectedNurse(null);
      setShowForm(false);
    }
  };

  const handleNewNurse = () => {
    setSelectedNurse(null);
    setShowForm(true);
  };

  const handleEditNurse = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedNurse(null);
    setShowForm(false);
  };

  return (
    <LayoutDashboard>
      <div className={`grid gap-6 ${showForm ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {/* Lista de enfermeros */}
        <div className={showForm ? "col-span-2" : "col-span-1"}>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Lista General de Enfermeros
              </h2>
              <button 
                onClick={handleNewNurse}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                + Registrar Enfermero
              </button>
            </div>
            <NurseTable 
              nursesData={nursesData}
              onDelete={handleDeleteNurse}
              onEdit={handleEditNurse}
            />
          </div>
        </div>

        {/* Formulario de registro/edición (solo visible cuando showForm es true) */}
        {showForm && (
          <div className="col-span-1 bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {selectedNurse ? "Editar Enfermero" : "Registrar Nuevo Enfermero"}
              </h2>
              <button
                onClick={handleCancelForm}
                className="text-gray-500 hover:text-gray-700 transition"
                title="Cerrar formulario"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NurseForm 
              nurse={selectedNurse}
              onAdd={handleAddNurse}
              onUpdate={handleUpdateNurse}
              onCancel={handleCancelForm}
            />
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}
