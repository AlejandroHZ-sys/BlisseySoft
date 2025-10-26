"use client";
// Asegúrate que esta importación apunte al 'page.tsx' que tiene la interfaz
import type { VitalSigns } from "../page"; 
import Input from "@/components/Input";

// 1. Interfaz de Errores actualizada con TODOS los campos
interface Props {
  vitals: VitalSigns;
  onChange: (vitals: VitalSigns) => void;
  errors?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    oxygenSaturation?: string;
    glucose?: string;       // Añadido
    evacuations?: string;   // Añadido
    urineMl?: string;       // Añadido
  };
}

export default function VitalSignsForm({ vitals, onChange, errors = {} }: Props) {
  
  // 2. handleChange actualizado con los nuevos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let regex = /.*/;

    switch (name) {
      case 'bloodPressure':
        regex = /^[0-9\/]*$/;
        break;
      case 'heartRate':
      case 'oxygenSaturation':
      case 'glucose':       // Añadido
      case 'evacuations':   // Añadido
      case 'urineMl':       // Añadido
        // Permite solo números enteros
        regex = /^[0-9]*$/;
        break;
      case 'temperature':
        // Permite números y un punto decimal
        regex = /^[0-9\.]*$/;
        break;
    }

    if (regex.test(value)) {
      onChange({ ...vitals, [name]: value });
    }
  };

  // 3. Layout actualizado a 3 columnas para que quepan
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
      
      {/* --- Fila 1 --- */}
      <div>
        <Input
          label="Presión Arterial (mmHg)"
          name="bloodPressure"
          value={vitals.bloodPressure}
          onChange={handleChange}
          placeholder="Ej: 120/80"
        />
        {errors.bloodPressure && (
          <p className="text-xs text-red-600 mt-1">{errors.bloodPressure}</p>
        )}
      </div>
      
      <div>
        <Input
          label="Frecuencia Cardíaca (lpm)"
          name="heartRate"
          value={vitals.heartRate}
          onChange={handleChange}
          placeholder="Ej: 75"
        />
        {errors.heartRate && (
          <p className="text-xs text-red-600 mt-1">{errors.heartRate}</p>
        )}
      </div>
      
      <div>
        <Input
          label="Temperatura (°C)"
          name="temperature"
          value={vitals.temperature}
          onChange={handleChange}
          placeholder="Ej: 36.5"
        />
        {errors.temperature && (
          <p className="text-xs text-red-600 mt-1">{errors.temperature}</p>
        )}
      </div>

      {/* --- Fila 2 --- */}
      <div>
        <Input
          label="Glucosa (mg/dL)"
          name="glucose"
          value={vitals.glucose}
          onChange={handleChange}
          placeholder="Ej: 95"
        />
        {errors.glucose && (
          <p className="text-xs text-red-600 mt-1">{errors.glucose}</p>
        )}
      </div>
      
      <div>
        <Input
          label="Saturación O₂ (%)"
          name="oxygenSaturation"
          value={vitals.oxygenSaturation}
          onChange={handleChange}
          placeholder="Ej: 98"
        />
        {errors.oxygenSaturation && (
          <p className="text-xs text-red-600 mt-1">{errors.oxygenSaturation}</p>
        )}
      </div>
      
      <div>
        <Input
          label="Orina (ml en 24h)"
          name="urineMl"
          value={vitals.urineMl}
          onChange={handleChange}
          placeholder="Ej: 300"
        />
        {errors.urineMl && (
          <p className="text-xs text-red-600 mt-1">{errors.urineMl}</p>
        )}
      </div>

      {/* --- Fila 3 --- */}
      <div>
        <Input
          label="Evacuaciones (en 24h)"
          name="evacuations"
          value={vitals.evacuations}
          onChange={handleChange}
          placeholder="Ej: 1"
        />
        {errors.evacuations && (
          <p className="text-xs text-red-600 mt-1">{errors.evacuations}</p>
        )}
      </div>
    </div>
  );
}
