export default function HomePage() {
  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Bienvenido al Sistema de Enfermería (SIGAE)
        </h1>
        <p className="text-gray-600 mb-8">
          Usa el menú lateral o accede a <strong>/personal</strong> para probar la pantalla de gestión de enfermeros.
        </p>
        <a
          href="/personal"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Ir a Gestión de Enfermeros
        </a>
      </div>
    </main>
  );
}
