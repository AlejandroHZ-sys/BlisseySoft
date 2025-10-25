"use client";
import type { VitalSigns } from "../page";
import Input from "@/components/Input";

interface Props {
  vitals: VitalSigns;
  onChange: (vitals: VitalSigns) => void;
  errors?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    oxygenSaturation?: string;
  };
}

export default function VitalSignsForm({ vitals, onChange, errors = {} }: Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...vitals, [name]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Input
        label="Presión Arterial (mmHg)"
        name="bloodPressure"
        value={vitals.bloodPressure}
        onChange={handleChange}
      />
      
      <div>
        <Input
          label="Frecuencia Cardíaca (lpm)"
          name="heartRate"
          value={vitals.heartRate}
          onChange={handleChange}
        />
        {errors.heartRate && (
          <p className="text-xs text-red-600 mt-1">{errors.heartRate}</p>
        )}
      </div>

      <Input
        label="Temperatura (°C)"
        name="temperature"
        value={vitals.temperature}
        onChange={handleChange}
      />
      <Input
        label="Saturación O₂ (%)"
        name="oxygenSaturation"
        value={vitals.oxygenSaturation}
        onChange={handleChange}
      />
    </div>
  );
}
