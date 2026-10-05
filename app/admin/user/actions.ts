"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function pastikanAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") redirect("/login");
  return s;
}

function galat(pesan: string): never {
  redirect("/admin/user?error=" + encodeURIComponent(pesan));
}

function sukses(pesan: string): never {
  revalidatePath("/admin/user");
  redirect("/admin/user?ok=" + encodeURIComponent(pesan));
}

function ambilRole(formData: FormData): Role {
  return formData.get("role") === "ADMIN" ? "ADMIN" : "KASIR";
}

export async function tambahUser(formData: FormData) {
  await pastikanAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = ambilRole(formData);

  if (!nama || !username) galat("Nama dan username wajib diisi");
  if (password.length < 6) galat("Password minimal 6 karakter");

  const ada = await prisma.user.findUnique({ where: { username } });
  if (ada) galat("Username sudah dipakai");

  await prisma.user.create({
    data: { nama, username, password: await bcrypt.hash(password, 10), role },
  });
  sukses("Akun berhasil ditambahkan");
}

export async function ubahUser(formData: FormData) {
  const s = await pastikanAdmin();

  const id = Number(formData.get("id"));
  const nama = String(formData.get("nama") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = ambilRole(formData);

  if (!nama) galat("Nama wajib diisi");
  if (password !== "" && password.length < 6) {
    galat("Password baru minimal 6 karakter");
  }
  if (id === s.userId && role !== "ADMIN") {
    galat("Kamu tidak bisa menurunkan role akunmu sendiri");
  }

  await prisma.user.update({
    where: { id },
    data: {
      nama,
      role,
      ...(password !== "" && { password: await bcrypt.hash(password, 10) }),
    },
  });
  sukses("Akun berhasil diperbarui");
}

export async function hapusUser(formData: FormData) {
  const s = await pastikanAdmin();
  const id = Number(formData.get("id"));

  if (id === s.userId) galat("Kamu tidak bisa menghapus akunmu sendiri");

  const trx = await prisma.transaksi.count({ where: { userId: id } });
  if (trx > 0) {
    galat("Akun ini sudah punya riwayat transaksi, tidak bisa dihapus");
  }

  await prisma.user.delete({ where: { id } });
  sukses("Akun berhasil dihapus");
}