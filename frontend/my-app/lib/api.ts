const API = process.env.NEXT_PUBLIC_API_URL;

function getApi() {
  if (!API) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_API_URL is not set. Create a .env.local file with NEXT_PUBLIC_API_URL=http://localhost:3001 (or your backend URL) and restart the dev server."
    );
  }
  return API;
}

// ---------- PACIENTES ----------
export async function getPacientes() {
  const r = await fetch(`${getApi()}/pacientes`);
  if (!r.ok) throw new Error("Error al obtener pacientes");
  return r.json();
}

export async function createPaciente(payload: any) {
  const r = await fetch(`${getApi()}/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Error al crear paciente");
  return r.json();
}

export async function updatePaciente(id: string | number, payload: any) {
  const r = await fetch(`${getApi()}/pacientes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Error al actualizar paciente");
  return r.json();
}

export async function deletePaciente(id: string | number) {
  const r = await fetch(`${getApi()}/pacientes/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Error al borrar paciente");
  return true;
}

// ---------- ENFERMEROS (para selects, etc.) ----------
export async function getEnfermeros() {
  const r = await fetch(`${getApi()}/enfermeros`);
  if (!r.ok) throw new Error("Error al obtener enfermeros");
  return r.json();
}
