import { prisma } from "@/lib/prisma";
import DismissibleSections from "@/components/admin/DismissibleSections";

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
    { id: "transaksi", icon: "🧾", label: "Transaksi hari ini", nilai: String(trxHariIni) },
    { id: "omzet", icon: "💰", label: "Omzet hari ini", nilai: rp(omzet._sum.total ?? 0) },
    { id: "menu", icon: "🍜", label: "Jumlah menu", nilai: String(jmlProduk) },
    { id: "member", icon: "👥", label: "Jumlah member", nilai: String(jmlMember) },
  ];

  const sections = [
    ...kartu.map((k) => ({
      id: k.id,
      content: (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD3A5] text-xl">
            {k.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#7A5A40]">{k.label}</p>
            <p className="truncate text-2xl font-bold text-[#FF5900]">
              {k.nilai}
            </p>
          </div>
        </div>
      ),
    })),
    {
      id: "stok",
      full: true,
      content: (
        <div>
          <h2 className="mb-3 font-semibold text-[#4A2A12]">
            ⚠️ Stok menipis (5 atau kurang)
          </h2>
          {menipis.length === 0 ? (
            <p className="text-sm text-[#7A5A40]">Semua stok aman. 🎉</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {menipis.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-[#FFFBDC] px-3 py-2 text-[#4A2A12]"
                >
                  <span>{p.nama}</span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                      p.stok === 0
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {p.stok === 0 ? "Habis" : `Sisa ${p.stok}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#FF5900]">Ringkasan</h1>
      <DismissibleSections sections={sections} />
    </div>
  );
}