"use client";
import { useState } from "react"; // <--- Importa useState
import type { Note } from "../page"; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2'; // <--- Importa SweetAlert
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// 1. Actualiza la interfaz de Props
interface Props {
  pastNotes: Note[];
  newNote: string;
  onNewNoteChange: (value: string) => void;
  onEditNote: (id: string, newText: string) => void; // <--- Nueva prop
  error?: string;
}

export default function EvolutionNotes({
  pastNotes,
  newNote,
  onNewNoteChange,
  onEditNote, // <--- Añade la prop
  error,
}: Props) {
  
  // 2. Añade estado interno para la edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // 3. Funciones para manejar la edición
  const handleEditClick = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveClick = (id: string) => {
    // Validamos aquí primero para no llamar al padre innecesariamente
    if (editText.trim() === "") {
      MySwal.fire({
        title: "Error",
        text: "La nota no puede estar vacía.",
        icon: "error",
        confirmButtonColor: "#3B82F6",
      });
      return; // No guardes
    }
    
    // Llama a la función del padre para guardar
    onEditNote(id, editText);
    
    // Cierra el modo edición
    setEditingId(null);
    setEditText("");
  };


  return (
    <div className="space-y-4">
      {/* Formulario para nueva nota (Sin cambios) */}
      <div>
        <label
          htmlFor="newNote"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Añadir Nueva Nota de Evolución
        </label>
        <textarea
          id="newNote"
          name="newNote"
          rows={4}
          value={newNote}
          onChange={(e) => onNewNoteChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Escribe la evolución del paciente..."
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      {/* --- 4. Historial de Notas (ACTUALIZADO CON LÓGICA DE EDICIÓN) --- */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 pt-4">
        <h3 className="text-md font-semibold text-gray-600">
          Historial de Notas
        </h3>
        {pastNotes.length === 0 && (
          <p className="text-sm text-gray-500">No hay notas anteriores.</p>
        )}
        {pastNotes.map((note) => (
          <div key={note.id} className="border-b border-gray-200 pb-3">
            {editingId === note.id ? (
              // --- MODO EDICIÓN ---
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveClick(note.id)}
                    className="text-green-600 hover:text-green-800 bg-green-100 px-3 py-1 rounded-md text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded-md text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // --- MODO LECTURA ---
              <div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {note.nurseName} - {new Date(note.timestamp).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleEditClick(note)}
                    className="text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md text-xs"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}