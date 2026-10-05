"use server";

import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Kategori } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const FOLDER = path.join(process.cwd(), "uploads");
const MAKS = 2 * 1024 * 1024; // 2 MB
const TIPE_OK: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

async function pastikanAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") redirect("/login");
}

function galat(pesan: string): never {
  redirect("/admin/barang?error=" + encodeURIComponent(pesan));
}

function segar() {
  revalidatePath("/admin/barang");
  revalidatePath("/admin");
  revalidatePath("/kasir");
}

function ambil(formData: FormData) {
  const nama = String(formData.get("nama") ?? "").trim();
  const harga = Number(formData.get("harga"));
  const stok = Number(formData.get("stok"));
  const kategori: Kategori =
    formData.get("kategori") === "MINUMAN" ? "MINUMAN" : "MAKANAN_BERAT";
  const valid = nama !== "" && harga >= 0 && stok >= 0;

  return {
    valid,
    data: {
      nama,
      harga: Math.round(harga),
      stok: Math.round(stok),
      kategori,
    },
  };
}

async function simpanFoto(formData: FormData): Promise<string | null> {
  const f = formData.get("gambar");
  if (!(f instanceof File) || f.size === 0) return null;

  const ext = TIPE_OK[f.type];
  if (!ext) galat("Foto harus berformat JPG, PNG, atau WEBP");
  if (f.size > MAKS) galat("Ukuran foto maksimal 2 MB");

  await mkdir(FOLDER, { recursive: true });
  const nama = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  await writeFile(path.join(FOLDER, nama), Buffer.from(await f.arrayBuffer()));
  return "/uploads/" + nama;
}

async function hapusFile(url: string | null) {
  if (!url || !url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(FOLDER, path.basename(url)));
  } catch {
    // file sudah tidak ada, abaikan
  }
}

export async function tambahBarang(formData: FormData) {
  await pastikanAdmin();
  const { valid, data } = ambil(formData);
  if (!valid) galat("Nama, harga, dan stok harus diisi dengan benar");

  const gambar = await simpanFoto(formData);

  await prisma.product.create({ data: { ...data, gambar } });
  segar();
  redirect("/admin/barang");
}

export async function ubahBarang(formData: FormData) {
  await pastikanAdmin();
  const id = Number(formData.get("id"));
  const { valid, data } = ambil(formData);
  if (!valid) galat("Nama, harga, dan stok harus diisi dengan benar");

  const lama = await prisma.product.findUnique({ where: { id } });
  if (!lama) galat("Barang tidak ditemukan");

  const fotoBaru = await simpanFoto(formData);
  const hapusFoto = formData.get("hapusFoto") === "on";

  let gambar = lama.gambar;
  if (fotoBaru) {
    gambar = fotoBaru;
  } else if (hapusFoto) {
    gambar = null;
  }

  await prisma.product.update({ where: { id }, data: { ...data, gambar } });

  if (gambar !== lama.gambar) await hapusFile(lama.gambar);

  segar();
  redirect("/admin/barang");
}

export async function hapusBarang(formData: FormData) {
  await pastikanAdmin();
  const id = Number(formData.get("id"));

  const terjual = await prisma.detailTransaksi.count({
    where: { productId: id },
  });
  if (terjual > 0) {
    galat("Barang sudah pernah terjual, tidak bisa dihapus. Set stoknya ke 0 saja.");
  }

  const lama = await prisma.product.findUnique({ where: { id } });
  await prisma.product.delete({ where: { id } });
  if (lama) await hapusFile(lama.gambar);

  segar();
  redirect("/admin/barang");
}