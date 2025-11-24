"use client";

import { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type Nurse = {
  id: string;
  name: string;
  curp: string;
  area: string;
  turno: string;
  status: string;
  lastUpdate: string;
  position: string;
  date: string;
  available: boolean;
  employeeNumber?: string;
  institutionalPhone?: string;
  institutionalEmail?: string;
  specialty?: string;
};

type Props = {
  nurse: Nurse | null;
  onAdd: (nurse: Nurse) => void;
  onUpdate: (nurse: Nurse) => void;
  onCancel: () => void;
};

export default function NurseForm({ nurse, onAdd, onUpdate, onCancel }: Props) {
  const [name, setName] = useState("");
  const [curp, setCurp] = useState("");
  const [position, setPosition] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState("Activo");
  
  // Campos opcionales administrativos
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [institutionalPhone, setInstitutionalPhone] = useState("");
  const [institutionalEmail, setInstitutionalEmail] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Cargar datos del enfermero cuando se selecciona para editar
  useEffect(() => {
    if (nurse) {
      setName(nurse.name || "");
      setCurp(nurse.curp || "");
      setPosition(nurse.position || "");
      setArea(nurse.area || "");
      setDate(nurse.date || "");
      setAvailable(nurse.available || false);
      setStatus(nurse.status || "Activo");
      setEmployeeNumber(nurse.employeeNumber || "");
      setInstitutionalPhone(nurse.institutionalPhone || "");
      setInstitutionalEmail(nurse.institutionalEmail || "");
      setSpecialty(nurse.specialty || "");
    } else {
      resetForm();
    }
  }, [nurse]);

  const resetForm = () => {
    setName("");
    setCurp("");
    setPosition("");
    setArea("");
    setDate("");
    setAvailable(false);
    setStatus("Activo");
    setEmployeeNumber("");
    setInstitutionalPhone("");
    setInstitutionalEmail("");
    setSpecialty("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nurseData: Nurse = {
      id: nurse?.id || `ENF${String(Date.now()).slice(-6)}`,
      name,
      curp,
      position,
      area,
      date,
      available,
      status,
      employeeNumber,
      institutionalPhone,
      institutionalEmail,
      specialty,
      turno: nurse?.turno || "Matutino", // Mantener turno existente o asignar default
      lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    
    if (nurse) {
      // Actualizar enfermero existente
      onUpdate(nurseData);
      await MySwal.fire({
        title: '¡Cambios guardados!',
        text: `La información de ${name} ha sido actualizada exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Aceptar'
      });
    } else {
      // Agregar nuevo enfermero
      onAdd(nurseData);
      await MySwal.fire({
        title: '¡Registro guardado!',
        text: `${name} ha sido registrado exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Aceptar'
      });
      resetForm();
    }
  };

  const handleCancel = async () => {
    const result = await MySwal.fire({
      title: '¿Cancelar edición?',
      text: 'Los cambios no guardados se perderán.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar editando'
    });

    if (result.isConfirmed) {
      resetForm();
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Datos Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            CURP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="CURP (18 caracteres)"
            value={curp}
            onChange={(e) => setCurp(e.target.value.toUpperCase())}
            maxLength={18}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200 uppercase"
          />
        </div>
      </div>

      {/* Datos Administrativos Obligatorios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Nivel o Puesto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Enfermero General, Jefe de Enfermería"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Área Base Principal <span className="text-red-500">*</span>
          </label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
          >
            <option value="">Seleccionar área</option>
            <option value="Urgencias">Urgencias</option>
            <option value="UCI">UCI</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Hospitalización">Hospitalización</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Maternidad">Maternidad</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Fecha de Ingreso <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
        />
      </div>

      {/* Datos Administrativos Opcionales */}
      <div className="border-t pt-4 mt-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Información Adicional (Opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Número de Empleado
            </label>
            <input
              type="text"
              placeholder="Ej: EMP-12345"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Especialidad
            </label>
            <input
              type="text"
              placeholder="Ej: Cuidados Intensivos, Pediatría"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Teléfono Institucional
            </label>
            <input
              type="tel"
              placeholder="Ej: ext. 1234"
              value={institutionalPhone}
              onChange={(e) => setInstitutionalPhone(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Correo Institucional
            </label>
            <input
              type="email"
              placeholder="nombre@hospital.gob.mx"
              value={institutionalEmail}
              onChange={(e) => setInstitutionalEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-cyan-200"
            />
          </div>
        </div>
      </div>

      {/* Disponibilidad y Estado */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={available}
          onChange={() => setAvailable(!available)}
          className="accent-cyan-600 w-4 h-4"
        />
        <label className="text-sm font-semibold text-gray-600">
          Disponible para turnos
        </label>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Documentos Adjuntos</label>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
          <Paperclip size={18} className="text-gray-400" />
          <span className="text-gray-500 text-sm">Subir archivo (PDF, JPG, PNG)</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">
          Estado <span className="text-red-500">*</span>
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-200"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 active:scale-95 transition transform text-white font-semibold px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 active:scale-95 transition transform text-gray-700 font-semibold px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
