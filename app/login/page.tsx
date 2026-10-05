"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { NAMA_TOKO } from "@/lib/config";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6EE]">
      <form
        action={action}
        className="w-full max-w-sm bg-[#FFFDF8] p-8 rounded-2xl shadow space-y-4"
      >
        <div className="text-center">
  <h1 className="text-2xl font-bold text-[#2F3B4A]">{NAMA_TOKO}</h1>
  <p className="text-sm text-[#7A8594]">Silakan masuk</p>
</div>

        <input
          name="username"
          placeholder="Username"
          required
          className="w-full border border-[#DCE6F0] rounded-lg px-3 py-2 text-[#2F3B4A]"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border border-[#DCE6F0] rounded-lg px-3 py-2 text-[#2F3B4A]"
        />

        {state?.error && (
          <p className="text-sm text-[#C4645A]">{state.error}</p>
        )}

        <button
          disabled={pending}
          className="w-full bg-[#6B8CAE] hover:bg-[#4A6A8A] text-white rounded-lg py-2 font-semibold disabled:opacity-60"
        >
          {pending ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}