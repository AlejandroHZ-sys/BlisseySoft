"use client";

import { useEffect, useState } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import { useRouter } from "next/navigation";
import type { HistorialRecord } from "../page";

export default function HistorialDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [record, setRecord] = useState<HistorialRecord | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("historial_records");
      if (!raw) return;
      const parsed = JSON.parse(raw) as HistorialRecord[];
      const found = parsed.find((r) => String(r.id) === String(id));
      if (found) setRecord(found);
    } catch (e) {
      // ignore
    }
  }, [id]);

  if (!record)
    return (
      <LayoutDashboard>
        <div className="p-6 bg-white rounded shadow">Registro no encontrado.</div>
      </LayoutDashboard>
    );

  return (
    <LayoutDashboard>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Historial clínico — {record.patientFullName}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-3 py-2 border rounded hover:bg-gray-100 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Volver
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Imprimir / Guardar como PDF
            </button>
          </div>
        </div>

        <section className="mb-4">
          <h2 className="font-semibold">Datos del paciente</h2>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <div className="text-sm text-gray-600">Nombre completo</div>
              <div className="font-medium">{record.patientFullName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">CURP</div>
              <div className="font-medium">{record.patientCurp || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Sexo / Edad</div>
              <div className="font-medium">{record.patientSex || '—'} / {record.patientAge || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Área / Cama</div>
              <div className="font-medium">{record.patientArea || '—'} / {record.patientBed || '—'}</div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold">Motivo y diagnóstico</h2>
          <div className="mt-2">
            <div className="text-sm text-gray-600">Motivo de ingreso</div>
            <div className="font-medium">{record.reasonForAdmission || '—'}</div>
            <div className="text-sm text-gray-600 mt-2">Diagnóstico inicial</div>
            <div className="font-medium">{record.initialDiagnosis || '—'}</div>
            <div className="text-sm text-gray-600 mt-2">Diagnóstico final</div>
            <div className="font-medium">{record.finalDiagnosis || '—'}</div>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold">Signos vitales</h2>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div>
              <div className="text-sm text-gray-600">Temperatura</div>
              <div className="font-medium">{record.vitals?.temperature || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Frecuencia cardíaca</div>
              <div className="font-medium">{record.vitals?.heartRate || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Presión arterial</div>
              <div className="font-medium">{record.vitals?.bloodPressure || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Frecuencia respiratoria</div>
              <div className="font-medium">{record.vitals?.respiratoryRate || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Saturación (SpO2)</div>
              <div className="font-medium">{record.vitals?.spo2 || '—'}</div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold">Evolución y notas</h2>
          <div className="mt-2 space-y-2">
            <div>
              <div className="text-sm text-gray-600">Notas médicas</div>
              <div className="font-medium whitespace-pre-wrap">{record.notes || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Notas de evolución</div>
              <div className="font-medium whitespace-pre-wrap">{record.evolutionNotes || '—'}</div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold">Metadatos del registro</h2>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <div className="text-sm text-gray-600">Fecha y hora</div>
              <div className="font-medium">{new Date(record.datetime).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Profesional</div>
              <div className="font-medium">{record.professional || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Estado</div>
              <div className="font-medium">{record.status || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Autoriza</div>
              <div className="font-medium">{record.authorizingDoctor || '—'}</div>
            </div>
          </div>
        </section>

        <div className="mt-6 text-sm text-gray-500">Imprime esta página o usa "Guardar como PDF" en el diálogo de impresión para generar un PDF.</div>
      </div>
    </LayoutDashboard>
  );
}
