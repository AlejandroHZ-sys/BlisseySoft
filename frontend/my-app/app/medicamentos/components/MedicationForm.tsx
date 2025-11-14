"use client";

import { useEffect, useState, FormEvent } from "react";
import type { Medication, MedicationType } from "../page";
import Input from "@/components/Input"; // Asume que tienes este Input reutilizable

interface Props {
  value: Medication | null;
  onSave: (med: Medication) => void;
  onCancel: () => void;
}

export default function MedicationForm({ value, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<Medication | null>(value);

  useEffect(() => {
    setFormData(value);
  }, [value]);

  if (!formData) {
    return (
      <div className="text-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-12 h-12 mx-auto text-gray-300"
        >
          {/* Un ícono de farmacia/pastilla sería genial aquí */}
          <path d="M11.383 3.084A1.125 1.125 0 0112 3.31c.32 0 .622-.135.834-.37l.024-.027a2.25 2.25 0 013.153-.13L17 3.5h.5a2.25 2.25 0 012.25 2.25v.5l.72.72a2.25 2.25 0 01.13 3.153l-.027.024a1.125 1.125 0 01-.37.834c0 .32.135.622.37.834l.027.024a2.25 2.25 0 01.13 3.153L20.5 17h-.5a2.25 2.25 0 01-2.25 2.25h-.5l-.72.72a2.25 2.25 0 01-3.153.13l-.024-.027a1.125 1.125 0 01-.834-.37c-.32 0-.622.135-.834.37l-.024.027a2.25 2.25 0 01-3.153-.13L7 20.5h-.5A2.25 2.25 0 014.25 18.25v-.5l-.72-.72a2.25 2.25 0 01-.13-3.153l.027-.024a1.125 1.125 0 01.37-.834c0-.32-.135-.622-.37-.834l-.027-.024a2.25 2.25 0 01-.13-3.153L3.5 7h.5A2.25 2.25 0 016.25 4.75h.5l.72-.72a2.25 2.25 0 013.153-.13l.024.027c.212.234.514.37.834.37zM11.25 9.75A1.5 1.5 0 108.25 12a1.5 1.5 0 003 0zm3 3A1.5 1.5 0 1011.25 12a1.5 1.5 0 003 0zm3-3A1.5 1.5 0 1014.25 12a1.5 1.5 0 003 0z" />
        </svg>
        <p className="mt-2">Selecciona un item para editar</p>
        <p className="text-sm">o haz clic en "+ Registrar Item" para empezar.</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permite solo números enteros para el stock
    if (/^[0-9]*$/.test(value)) {
      setFormData((prev) =>
        prev ? { ...prev, [name]: value === '' ? 0 : parseInt(value, 10) } : null
      );
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Item"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <Input
        label="Presentación"
        name="presentacion"
        value={formData.presentacion}
        onChange={handleChange}
        placeholder="Ej: Tableta 500mg, Frasco 1L"
        required
      />
      
      <div>
        <label
          htmlFor="tipo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Medicamento">Medicamento</option>
          <option value="Insumo">Insumo</option>
        </select>
      </div>

      <Input
        label="Stock Inicial"
        name="cantidadDisponible"
        type="text" // Usamos text para controlar el formato
        value={formData.cantidadDisponible.toString()}
        onChange={handleNumberChange}
        required
      />

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
