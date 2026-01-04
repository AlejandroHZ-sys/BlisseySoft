"use client";
import type { Nurse } from "../page";

interface Props {
  nurses: Nurse[];
  selectedId: string | null;
  onSelect: (nurse: Nurse) => void;
}

export default function NurseList({ nurses, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {nurses.map((nurse) => {
        const isSelected = selectedId === nurse.id;
        return (
          <button
            key={nurse.id}
            onClick={() => onSelect(nurse)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              isSelected
                ? "bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500"
                : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                {nurse.nombre}
              </span>
              {isSelected && (
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nurse.departamento}
            </div>
          </button>
        );
      })}
    </div>
  );
}
