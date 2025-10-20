export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-cyan-700 text-center mb-2">
          Iniciar Sesión
        </h1>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Usuario
            </label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
