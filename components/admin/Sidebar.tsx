"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";

const MENU = [
  { href: "/admin", label: "Ringkasan", icon: "📊" },
  { href: "/admin/barang", label: "Data Barang", icon: "📦" },
  { href: "/admin/member", label: "Data Member", icon: "👥" },
  { href: "/admin/user", label: "Akun Admin & Kasir", icon: "🔑" },
];

export default function Sidebar({
  namaToko,
  namaUser,
}: {
  namaToko: string;
  namaUser: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes slideInMenu {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Tombol menu di HP */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-40 rounded-lg bg-[#FF5900] px-3 py-2 text-white shadow-md md:hidden"
        aria-label="Buka menu"
      >
        ☰
      </button>

      {/* Overlay HP */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#FF5900] text-white shadow-xl transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/20 p-5">
          <h1 className="text-xl font-bold">{namaToko}</h1>
          <p className="mt-1 text-xs text-white/80">Admin: {namaUser}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {MENU.map((item, i) => {
            const aktif =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  animation: "slideInMenu 0.4s ease both",
                  animationDelay: `${i * 70}ms`,
                }}
                className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  aktif
                    ? "bg-[#FFFBDC] text-[#FF5900] shadow-md"
                    : "text-white hover:translate-x-1 hover:bg-[#FF8237]"
                }`}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-125">
                  {item.icon}
                </span>
                {item.label}
                {aktif && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#FF5900]" />
                )}
              </Link>
            );
          })}
        </nav>

        <form action={logout} className="p-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white hover:text-[#FF5900]">
            🚪 Logout
          </button>
        </form>
      </aside>
    </>
  );
}