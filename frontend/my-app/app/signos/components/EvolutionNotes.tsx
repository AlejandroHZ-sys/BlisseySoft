"use client";
import type { Note } from "../page";

interface Props {
  pastNotes: Note[];
  newNote: string;
  onNewNoteChange: (value: string) => void;
  error?: string;
}

export default function EvolutionNotes({
  pastNotes,
  newNote,
  onNewNoteChange,
  error,
}: Props) {
  return (
    // Quitamos el <h2> de "Notas de Evolución" de aquí
    <div className="space-y-4">
      {/* Formulario para nueva nota */}
      <div>
        <label
          htmlFor="newNote"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Añadir Nueva Nota de Evolución
        </label>
        <textarea
          // ... (resto del textarea sin cambios)
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

      {/* Historial de Notas */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 pt-4">
        <h3 className="text-md font-semibold text-gray-600">
          Historial de Notas
        </h3>
        {pastNotes.length === 0 && (
          <p className="text-sm text-gray-500">No hay notas anteriores.</p>
        )}
        {pastNotes.map((note) => (
          <div key={note.id} className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-800">{note.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {note.nurseName} - {new Date(note.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
