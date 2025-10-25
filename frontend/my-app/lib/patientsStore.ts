import { create } from "zustand";
import {
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from "./api";

export type PatientStatus = "Activo" | "Observación" | "Alta" | "Traslado";

export type Patient = {
  id: string | number;
  fullName: string;
  curp: string;
  area: string;
  bed: string;
  sex: string;
  status: PatientStatus;
  nurse: string;
};

type PatientsState = {
  pacientes: Patient[];
  loading: boolean;
  error: string | null;
  fetchPacientes: () => Promise<void>;
  addPaciente: (p: Omit<Patient, "id">) => Promise<void>;
  editPaciente: (id: string | number, p: Partial<Patient>) => Promise<void>;
  removePaciente: (id: string | number) => Promise<void>;
};

export const usePacientesStore = create<PatientsState>((set, get) => ({
  pacientes: [],
  loading: false,
  error: null,

  fetchPacientes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getPacientes();
      set({ pacientes: data, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message || "Error cargando pacientes" });
    }
  },

  addPaciente: async (p) => {
    set({ loading: true, error: null });
    try {
      const nuevo = await createPaciente(p);
      set((s) => ({ pacientes: [nuevo, ...s.pacientes], loading: false }));
    } catch (e: any) {
      set({ loading: false, error: e?.message || "Error creando paciente" });
    }
  },

  editPaciente: async (id, p) => {
    set({ loading: true, error: null });
    try {
      const actualizado = await updatePaciente(id, p);
      set((s) => ({
        pacientes: s.pacientes.map((x) => (x.id === id ? actualizado : x)),
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false, error: e?.message || "Error actualizando paciente" });
    }
  },

  removePaciente: async (id) => {
    set({ loading: true, error: null });
    try {
      await deletePaciente(id);
      set((s) => ({
        pacientes: s.pacientes.filter((x) => x.id !== id),
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false, error: e?.message || "Error borrando paciente" });
    }
  },
}));
