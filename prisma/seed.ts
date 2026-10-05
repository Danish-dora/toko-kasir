import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { username: "budiadmin" },
    update: {},
    create: { nama: "Budi", username: "budiadmin", password, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { username: "sitikasir" },
    update: {},
    create: { nama: "Siti", username: "sitikasir", password, role: "KASIR" },
  });

  const produk = [
    { nama: "Nasi Goreng Spesial", harga: 20000, stok: 30, kategori: "MAKANAN_BERAT" },
    { nama: "Ayam Geprek + Nasi", harga: 18000, stok: 30, kategori: "MAKANAN_BERAT" },
    { nama: "Mie Goreng", harga: 15000, stok: 30, kategori: "MAKANAN_BERAT" },
    { nama: "Soto Ayam", harga: 17000, stok: 25, kategori: "MAKANAN_BERAT" },
    { nama: "Es Teh Manis", harga: 5000, stok: 50, kategori: "MINUMAN" },
    { nama: "Es Jeruk", harga: 7000, stok: 50, kategori: "MINUMAN" },
    { nama: "Kopi Susu", harga: 12000, stok: 40, kategori: "MINUMAN" },
    { nama: "Air Mineral", harga: 4000, stok: 60, kategori: "MINUMAN" },
  ] as const;

  for (const p of produk) {
    await prisma.product.create({ data: p });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());