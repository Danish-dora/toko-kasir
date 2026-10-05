import { prisma } from "@/lib/prisma";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default async function AdminHome() {
  const awal = new Date();
  awal.setHours(0, 0, 0, 0);

  const [jmlProduk, jmlMember, trxHariIni, omzet, menipis] = await Promise.all([
    prisma.product.count(),
    prisma.member.count(),
    prisma.transaksi.count({ where: { tanggal: { gte: awal } } }),
    prisma.transaksi.aggregate({
      _sum: { total: true },
      where: { tanggal: { gte: awal } },
    }),
    prisma.product.findMany({
      where: { stok: { lte: 5 } },
      orderBy: { stok: "asc" },
    }),
  ]);

  const kartu = [
    { label: "Transaksi hari ini", nilai: String(trxHariIni) },
    { label: "Omzet hari ini", nilai: rp(omzet._sum.total ?? 0) },
    { label: "Jumlah menu", nilai: String(jmlProduk) },
    { label: "Jumlah member", nilai: String(jmlMember) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-[#2F3B4A]">Ringkasan</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kartu.map((k) => (
          <div key={k.label} className="bg-[#FFFDF8] rounded-xl shadow-sm p-4">
            <p className="text-sm text-[#7A8594]">{k.label}</p>
            <p className="text-xl font-bold text-[#2F3B4A]">{k.nilai}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFDF8] rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-[#2F3B4A] mb-2">
          Stok menipis (5 atau kurang)
        </h2>
        {menipis.length === 0 ? (
          <p className="text-sm text-[#7A8594]">Semua stok aman.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {menipis.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.nama}</span>
                <span className="text-[#C4645A] font-semibold">
                  {p.stok === 0 ? "Habis" : `Sisa ${p.stok}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}