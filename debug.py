import os

ruta_core = os.path.join("backend", "core")

print(f"--- INSPECCIONANDO LA CARPETA: {ruta_core} ---")

if os.path.exists(ruta_core):
    archivos = os.listdir(ruta_core)
    print("Python ve estos archivos aquí:")
    for archivo in archivos:
        print(f" - {archivo}")
else:
    print("❌ ¡ALERTA! Python dice que la carpeta 'backend/core' NO EXISTE.")
    