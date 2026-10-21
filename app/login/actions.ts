"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleDipilih = String(formData.get("role") ?? "");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Username atau password salah" };
  }

  // Cek apakah akun sesuai dengan tab yang dipilih (Admin / Kasir)
  const roleAkun = user.role === "ADMIN" ? "admin" : "kasir";
  if (roleDipilih !== roleAkun) {
    return {
      error:
        roleAkun === "admin"
          ? "Akun ini adalah Admin. Pilih tab Admin untuk masuk."
          : "Akun ini adalah Kasir. Pilih tab Kasir untuk masuk.",
    };
  }

  await createSession({ userId: user.id, nama: user.nama, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : "/kasir");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}