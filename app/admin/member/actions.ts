"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function pastikanAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") redirect("/login");
}

function galat(pesan: string): never {
  redirect("/admin/member?error=" + encodeURIComponent(pesan));
}

function sukses(pesan: string): never {
  revalidatePath("/admin/member");
  revalidatePath("/admin");
  redirect("/admin/member?ok=" + encodeURIComponent(pesan));
}

function ambil(formData: FormData) {
  return {
    nama: String(formData.get("nama") ?? "").trim(),
    telp: String(formData.get("telp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    alamat: String(formData.get("alamat") ?? "").trim() || null,
  };
}

export async function tambahMember(formData: FormData) {
  await pastikanAdmin();
  const data = ambil(formData);
  if (!data.nama || !data.telp) galat("Nama dan no. telp wajib diisi");

  const ada = await prisma.member.findUnique({ where: { telp: data.telp } });
  if (ada) galat("No. telp sudah terdaftar");

  await prisma.member.create({
    data: { ...data, kodeMember: "MBR-" + Date.now().toString().slice(-6) },
  });
  sukses("Member berhasil ditambahkan");
}

export async function ubahMember(formData: FormData) {
  await pastikanAdmin();
  const id = Number(formData.get("id"));
  const data = ambil(formData);
  if (!data.nama || !data.telp) galat("Nama dan no. telp wajib diisi");

  const ada = await prisma.member.findUnique({ where: { telp: data.telp } });
  if (ada && ada.id !== id) galat("No. telp sudah dipakai member lain");

  await prisma.member.update({ where: { id }, data });
  sukses("Data member berhasil diperbarui");
}

export async function hapusMember(formData: FormData) {
  await pastikanAdmin();
  const id = Number(formData.get("id"));

  const trx = await prisma.transaksi.count({ where: { memberId: id } });
  if (trx > 0) {
    galat("Member ini sudah punya riwayat transaksi, tidak bisa dihapus");
  }

  await prisma.member.delete({ where: { id } });
  sukses("Member berhasil dihapus");
}