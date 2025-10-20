"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ClipboardList,
  CalendarDays,
  BarChart3,
  GraduationCap,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Personal de Enfermería", path: "/personal", icon: Users },
    { name: "Gestión de Turnos", path: "/turnos", icon: CalendarDays },
    { name: "Asignación de Turnos", path: "/asignaciones", icon: ClipboardList },
    { name: "Reportes", path: "/reportes", icon: BarChart3 },
    { name: "Capacitación", path: "/capacitacion", icon: GraduationCap },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-cyan-700 to-blue-600 text-white flex flex-col shadow-xl">
      <div className="flex items-center gap-3 px-6 py-6 mb-2">
        <img
          src="/logo-nursia.png"
          alt="NURSIA"
          className="h-9 w-9 rounded-full bg-white p-1 shadow"
        />
        <span className="text-xl font-bold tracking-wide">BlisseySoft</span>
      </div>
      <nav className="flex-1 px-2 mt-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-2 transition text-base font-medium relative group ${
                active
                  ? "bg-white/20 text-white font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-cyan-300 before:rounded-full"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <Icon size={20} className="text-white" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-cyan-100 opacity-70">
        Healthlife Systems © 2025
      </div>
    </aside>
  );
}
