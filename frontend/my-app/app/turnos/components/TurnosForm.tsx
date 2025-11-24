"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type Turno = {
  id: string;
  nombre: string;
  tipo: "Matutino" | "Vespertino" | "Nocturno" | "Especial";
  horaInicio: string;
  horaFin: string;
  estado: "Activo" | "Inactivo" | "Especial";
  area?: string;
  descripcion?: string;
  diasSemana?: string[];
  tieneAsignaciones?: boolean;
};

type TurnosFormProps = {
  turno: Turno | null;
  onAdd: (turno: Turno) => void;
  onUpdate: (turno: Turno) => void;
  onCancel: () => void;
};

export default function TurnosForm({
  turno,
  onAdd,
  onUpdate,
  onCancel,
}: TurnosFormProps) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<Turno["tipo"]>("Matutino");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [estado, setEstado] = useState<Turno["estado"]>("Activo");
  const [area, setArea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [diasSemana, setDiasSemana] = useState<string[]>([]);

  const diasOptions = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Determinar tipo de turno automáticamente basado en las horas
  const determinarTipoTurno = (inicio: string, fin: string): Turno["tipo"] => {
    if (!inicio || !fin) return tipo; // Mantener el tipo actual si no hay horas

    const [horaInicio, minInicio] = inicio.split(":").map(Number);
    const [horaFin, minFin] = fin.split(":").map(Number);

    const minutosInicio = horaInicio * 60 + minInicio;
    const minutosFin = horaFin * 60 + minFin;

    // Si hora fin es menor que inicio, asumimos turno que cruza medianoche (Nocturno)
    if (minutosFin < minutosInicio) {
      return "Nocturno";
    }

    // Matutino: inicia entre 6:00 AM y 11:59 AM
    if (minutosInicio >= 6 * 60 && minutosInicio < 12 * 60) {
      return "Matutino";
    }

    // Vespertino: inicia entre 12:00 PM y 7:59 PM
    if (minutosInicio >= 12 * 60 && minutosInicio < 20 * 60) {
      return "Vespertino";
    }

    // Nocturno: inicia entre 8:00 PM y 5:59 AM
    if (minutosInicio >= 20 * 60 || minutosInicio < 6 * 60) {
      return "Nocturno";
    }

    return "Especial";
  };

  // Actualizar tipo automáticamente cuando cambian las horas
  useEffect(() => {
    if (horaInicio && horaFin) {
      const tipoSugerido = determinarTipoTurno(horaInicio, horaFin);
      setTipo(tipoSugerido);
    }
  }, [horaInicio, horaFin]);

  // Cargar datos del turno en modo edición
  useEffect(() => {
    if (turno) {
      setNombre(turno.nombre);
      setTipo(turno.tipo);
      setHoraInicio(turno.horaInicio);
      setHoraFin(turno.horaFin);
      setEstado(turno.estado);
      setArea(turno.area || "");
      setDescripcion(turno.descripcion || "");
      setDiasSemana(turno.diasSemana || []);
    } else {
      resetForm();
    }
  }, [turno]);

  const resetForm = () => {
    setNombre("");
    setTipo("Matutino");
    setHoraInicio("");
    setHoraFin("");
    setEstado("Activo");
    setArea("");
    setDescripcion("");
    setDiasSemana([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación 1: Nombre obligatorio
    if (!nombre.trim()) {
      MySwal.fire({
        title: "Error",
        text: "El nombre del turno es obligatorio",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validación 2: Horarios válidos
    if (!horaInicio || !horaFin) {
      MySwal.fire({
        title: "Error",
        text: "Debes ingresar hora de inicio y hora de fin",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validación 3: No permitir turnos con duración 0
    const [horaInicioNum, minInicioNum] = horaInicio.split(":").map(Number);
    const [horaFinNum, minFinNum] = horaFin.split(":").map(Number);
    const minutosInicio = horaInicioNum * 60 + minInicioNum;
    const minutosFin = horaFinNum * 60 + minFinNum;

    // Si las horas son exactamente iguales (duración 0)
    if (minutosInicio === minutosFin) {
      MySwal.fire({
        title: "Error",
        text: "El turno debe tener una duración mayor a 0 horas",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const turnoData: Turno = {
      id: turno?.id || `TUR${Date.now()}`,
      nombre,
      tipo,
      horaInicio,
      horaFin,
      estado,
      area: area || undefined,
      descripcion: descripcion || undefined,
      diasSemana: diasSemana.length > 0 ? diasSemana : undefined,
    };

    if (turno) {
      onUpdate(turnoData);
    } else {
      onAdd(turnoData);
    }

    MySwal.fire({
      title: "¡Éxito!",
      text: `Turno ${turno ? "actualizado" : "registrado"} correctamente`,
      icon: "success",
      confirmButtonColor: "#10b981",
    });

    if (!turno) {
      resetForm();
    }
  };

  const handleCancel = () => {
    MySwal.fire({
      title: "¿Cancelar?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        onCancel();
      }
    });
  };

  const toggleDia = (dia: string) => {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {turno ? "Editar Turno" : "Registrar Nuevo Turno"}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cerrar"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Turno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Turno *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ej: Turno Matutino Regular"
              />
            </div>

            {/* Tipo de Turno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Turno *
              </label>
              <select
                required
                value={tipo}
                onChange={(e) => setTipo(e.target.value as Turno["tipo"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50"
                title="El tipo se ajusta automáticamente según el horario seleccionado"
              >
                <option value="Matutino">Matutino (6:00 AM - 11:59 AM)</option>
                <option value="Vespertino">Vespertino (12:00 PM - 7:59 PM)</option>
                <option value="Nocturno">Nocturno (8:00 PM - 5:59 AM)</option>
                <option value="Especial">Turno Especial</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                💡 Se ajusta automáticamente según las horas ingresadas
              </p>
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área (Opcional)
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Turno General</option>
                <option value="Urgencias">Urgencias</option>
                <option value="UCI">UCI</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Cirugía">Cirugía</option>
                <option value="Hospitalización">Hospitalización</option>
                <option value="Maternidad">Maternidad</option>
                <option value="Consulta Externa">Consulta Externa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Horarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hora de Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Inicio *
              </label>
              <input
                type="time"
                required
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Hora de Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Fin *
              </label>
              <input
                type="time"
                required
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Días de la Semana */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Días de la Semana (Opcional)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {diasOptions.map((dia) => (
              <button
                key={dia}
                type="button"
                onClick={() => toggleDia(dia)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  diasSemana.includes(dia)
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>

        {/* Estado y Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              required
              value={estado}
              onChange={(e) => setEstado(e.target.value as Turno["estado"])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Especial">Especial</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ej: Turno para fines de semana"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            {turno ? "Actualizar Turno" : "Guardar Turno"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
