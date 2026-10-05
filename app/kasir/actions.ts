"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DISKON_MEMBER } from "@/lib/config";

export async function cariMember(telp: string) {
  const session = await getSession();
  if (!session) return null;

  const m = await prisma.member.findUnique({ where: { telp: telp.trim() } });
  if (!m) return null;
  return { id: m.id, nama: m.nama, telp: m.telp, kodeMember: m.kodeMember };
}

export async function daftarMember(input: {
  nama: string;
  telp: string;
  email?: string;
  alamat?: string;
}) {
  const session = await getSession();
  if (!session) return { error: "Belum login" };

  const nama = input.nama.trim();
  const telp = input.telp.trim();
  if (!nama || !telp) return { error: "Nama dan no. telp wajib diisi" };

  const ada = await prisma.member.findUnique({ where: { telp } });
  if (ada) return { error: "No. telp sudah terdaftar" };

  const m = await prisma.member.create({
    data: {
      kodeMember: "MBR-" + Date.now().toString().slice(-6),
      nama,
      telp,
      email: input.email?.trim() || null,
      alamat: input.alamat?.trim() || null,
    },
  });

  return {
    member: { id: m.id, nama: m.nama, telp: m.telp, kodeMember: m.kodeMember },
  };
}

type CheckoutInput = {
  items: { productId: number; qty: number }[];
  memberId: number | null;
  metodeBayar: "TUNAI" | "TRANSFER";
  uangDiterima?: number;
};

export async function checkout(
  input: CheckoutInput
): Promise<{ kode: string } | { error: string }> {
  const session = await getSession();
  if (!session || session.role !== "KASIR") return { error: "Tidak punya akses" };
  if (input.items.length === 0) return { error: "Keranjang kosong" };

  try {
    const kode = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: input.items.map((i) => i.productId) } },
      });

      let subtotal = 0;
      const detail = input.items.map((i) => {
        const p = products.find((x) => x.id === i.productId);
        if (!p) throw new Error("Produk tidak ditemukan");
        if (i.qty < 1 || i.qty > p.stok) {
          throw new Error(`Stok ${p.nama} tidak cukup`);
        }
        const sub = p.harga * i.qty;
        subtotal += sub;
        return { productId: p.id, qty: i.qty, harga: p.harga, subtotal: sub };
      });

      let diskon = 0;
      if (input.memberId) {
        const m = await tx.member.findUnique({ where: { id: input.memberId } });
        if (!m) throw new Error("Member tidak ditemukan");
        diskon = Math.round((subtotal * DISKON_MEMBER) / 100);
      }
      const total = subtotal - diskon;

      let uangDiterima: number | null = null;
      let kembalian: number | null = null;
      if (input.metodeBayar === "TUNAI") {
        uangDiterima = input.uangDiterima ?? 0;
        if (uangDiterima < total) throw new Error("Uang diterima kurang dari total");
        kembalian = uangDiterima - total;
      }

      const kode = "TRX-" + Date.now();

      await tx.transaksi.create({
        data: {
          kode,
          userId: session.userId,
          memberId: input.memberId,
          subtotal,
          diskon,
          total,
          metodeBayar: input.metodeBayar,
          statusBayar: "LUNAS",
          uangDiterima,
          kembalian,
          detail: { create: detail },
        },
      });

      for (const d of detail) {
        await tx.product.update({
          where: { id: d.productId },
          data: { stok: { decrement: d.qty } },
        });
      }

      return kode;
    });

    return { kode };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan transaksi" };
  }
}