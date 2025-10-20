"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <Navbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
