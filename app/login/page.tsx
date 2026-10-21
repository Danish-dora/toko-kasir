"use client";

import { useState, useActionState } from "react";
import { login } from "./actions";
import { NAMA_TOKO } from "@/lib/config";

type Role = "admin" | "kasir";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [role, setRole] = useState<Role>("admin");

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFBDC] px-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <form
        action={action}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-[#FFD3A5] space-y-4"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FF5900]">{NAMA_TOKO}</h1>
          <p
            key={role}
            className="text-sm text-[#7A5A40] animate-[fadeIn_0.3s_ease]"
          >
            Login sebagai{" "}
            <span className="font-semibold text-[#FF8237]">
              {role === "admin" ? "Admin" : "Kasir"}
            </span>
          </p>
        </div>

        {/* TOMBOL GESER ADMIN / KASIR */}
        <div className="relative flex rounded-full bg-[#FFD3A5]/50 p-1">
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#FF5900] shadow-md transition-transform duration-300 ease-in-out ${
              role === "kasir" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-300 ${
              role === "admin" ? "text-white" : "text-[#7A5A40]"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setRole("kasir")}
            className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-300 ${
              role === "kasir" ? "text-white" : "text-[#7A5A40]"
            }`}
          >
            Kasir
          </button>
        </div>

        <input type="hidden" name="role" value={role} />

        <input
          name="username"
          placeholder={role === "admin" ? "Username admin" : "Username kasir"}
          required
          className="w-full border border-[#FFD3A5] rounded-lg px-3 py-2 text-[#4A2A12] placeholder:text-[#C9A582] focus:outline-none focus:ring-2 focus:ring-[#FFAA6E] focus:border-[#FFAA6E]"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border border-[#FFD3A5] rounded-lg px-3 py-2 text-[#4A2A12] placeholder:text-[#C9A582] focus:outline-none focus:ring-2 focus:ring-[#FFAA6E] focus:border-[#FFAA6E]"
        />

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <button
          disabled={pending}
          className="w-full bg-[#FF5900] hover:bg-[#FF8237] text-white rounded-lg py-2 font-semibold transition-colors disabled:opacity-60"
        >
          {pending
            ? "Masuk..."
            : role === "admin"
            ? "Masuk sebagai Admin"
            : "Masuk sebagai Kasir"}
        </button>
      </form>
    </main>
  );
}