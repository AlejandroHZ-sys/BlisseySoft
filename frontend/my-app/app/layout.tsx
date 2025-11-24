import "../styles/globals.css";

import { ReactNode } from "react";
import { TurnosProvider } from "./context/TurnosContext";
import { EnfermerosProvider } from "./context/EnfermerosContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <EnfermerosProvider>
          <TurnosProvider>{children}</TurnosProvider>
        </EnfermerosProvider>
      </body>
    </html>
  );
}
