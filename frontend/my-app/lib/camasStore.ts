import { create } from "zustand";
import { getCamas, createCama, updateCama, deleteCama } from "./api";

export interface Cama {
  id: number;
  identificador: string;
  habitacion: string;
  area: string;
  estado: "Disponible" | "Ocupada" | "En Mantenimiento" | "Reservada";
}

interface CamasState {
  camas: Cama[];
  loading: boolean;
  error: string | null;
  fetchCamas: () => Promise<void>;
  addCama: (cama: Omit<Cama, "id">) => Promise<void>;
  editCama: (id: number, updates: Partial<Cama>) => Promise<void>;
  removeCama: (id: number) => Promise<void>;
}

export const useCamasStore = create<CamasState>((set) => ({
  camas: [],
  loading: false,
  error: null,

  fetchCamas: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCamas();
      set({ camas: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addCama: async (cama) => {
    set({ loading: true, error: null });
    try {
      const newCama = await createCama(cama);
      set((state) => ({
        camas: [...state.camas, newCama],
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  editCama: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateCama(id, updates);
      set((state) => ({
        camas: state.camas.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removeCama: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCama(id);
      set((state) => ({
        camas: state.camas.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
