"use client";

interface Props {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TabButton({ label, isActive, onClick }: Props) {
  const activeClasses = "border-blue-600 text-blue-600 font-semibold";
  const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 -mb-px border-b-2 transition-colors ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
}
