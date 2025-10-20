"use client";
import { Bell, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-cyan-700 to-blue-500 shadow-md h-20 flex justify-end items-center px-8">
      <div className="flex items-center gap-6">
        <Bell size={24} className="text-white cursor-pointer hover:text-cyan-200 transition" />
        <span className="text-sm text-white font-medium flex items-center gap-2">
          <span>Hola, Enfermera</span>
          <UserCircle2 size={32} className="text-white" />
        </span>
      </div>
    </header>
  );
}
