
import { prisma } from "@/lib/prisma";
import DismissibleSections from "@/components/admin/DismissibleSections";

const rp = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

const tanggalID = (tanggal: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(tanggal);

const waktuID = (tanggal: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(tanggal);

const angkaID = (angka: number) =>
  new Intl.NumberFormat("id-ID").format(angka);

const hariID = (tanggal: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    timeZone: "Asia/Jakarta",
  }).format(tanggal);

export default async function AdminHome() {
  const sekarang = new Date();

  const awalHari = new Date(sekarang);
  awalHari.setHours(0, 0, 0, 0);

  // Mulai dari 6 hari lalu, termasuk hari ini.
  const awalMinggu = new Date(awalHari);
  awalMinggu.setDate(awalMinggu.getDate() - 6);

  const [
    jmlProduk,
    jmlMember,
    trxHariIni,
    omzetHariIni,
    menipis,
    transaksiTerbaru,
    transaksiMinggu,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.member.count(),

    prisma.transaksi.count({
      where: { tanggal: { gte: awalHari } },
    }),

    prisma.transaksi.aggregate({
      _sum: { total: true },
      where: { tanggal: { gte: awalHari } },
    }),

    prisma.product.findMany({
      where: { stok: { lte: 5 } },
      orderBy: { stok: "asc" },
      take: 8,
    }),

    prisma.transaksi.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
      select: {
        id: true,
        tanggal: true,
        total: true,
      },
    }),

    prisma.transaksi.findMany({
      where: { tanggal: { gte: awalMinggu } },
      select: {
        tanggal: true,
        total: true,
      },
      orderBy: { tanggal: "asc" },
    }),
  ]);

  const omzet = Number(omzetHariIni._sum.total ?? 0);

  // Mengelompokkan omzet berdasarkan tanggal lokal.
  const kunciTanggal = (tanggal: Date) =>
    `${tanggal.getFullYear()}-${String(
      tanggal.getMonth() + 1
    ).padStart(2, "0")}-${String(
      tanggal.getDate()
    ).padStart(2, "0")}`;

  const dataOmzet = new Map<string, number>();

  for (const trx of transaksiMinggu) {
    const key = kunciTanggal(new Date(trx.tanggal));

    dataOmzet.set(
      key,
      (dataOmzet.get(key) ?? 0) + Number(trx.total ?? 0)
    );
  }

  const grafik = Array.from({ length: 7 }, (_, i) => {
    const tanggal = new Date(awalMinggu);
    tanggal.setDate(awalMinggu.getDate() + i);

    return {
      tanggal,
      hari: hariID(tanggal),
      omzet: dataOmzet.get(kunciTanggal(tanggal)) ?? 0,
    };
  });

  const totalOmzetMinggu = grafik.reduce(
    (total, hari) => total + hari.omzet,
    0
  );

  const nilaiMaksimum = Math.max(
    ...grafik.map((hari) => hari.omzet),
    1
  );

  // Koordinat grafik SVG.
  const titikGrafik = grafik
    .map((hari, i) => {
      const x = 28 + i * (544 / 6);
      const y = 145 - (hari.omzet / nilaiMaksimum) * 115;
      return `${x},${y}`;
    })
    .join(" ");

  const kartu = [
    {
      id: "transaksi",
      icon: "🧾",
      label: "Transaksi hari ini",
      nilai: angkaID(trxHariIni),
      deskripsi: "Transaksi tercatat",
    },
    {
      id: "omzet",
      icon: "💰",
      label: "Omzet hari ini",
      nilai: rp(omzet),
      deskripsi: "Total penjualan hari ini",
    },
    {
      id: "menu",
      icon: "🛍️",
      label: "Jumlah menu",
      nilai: angkaID(jmlProduk),
      deskripsi: "Produk terdaftar",
    },
    {
      id: "member",
      icon: "👥",
      label: "Jumlah member",
      nilai: angkaID(jmlMember),
      deskripsi: "Member terdaftar",
    },
  ];

  const sections = [
    ...kartu.map((k) => ({
      id: k.id,
      content: (
        <div className="group relative flex min-h-[132px] items-center gap-4 overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute -bottom-8 -right-5 h-20 w-20 rounded-tl-full bg-orange-50" />

          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-2xl">
            {k.icon}
          </div>

          <div className="relative min-w-0">
            <p className="text-sm font-medium text-slate-600">
              {k.label}
            </p>
            <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-orange-600">
              {k.nilai}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {k.deskripsi}
            </p>
          </div>
        </div>
      ),
    })),
    {
      id: "stok",
      full: true,
      content: (
        <section className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-2xl text-white shadow-md shadow-orange-200">
                ⚠
              </div>

              <div>
                <h2 className="text-lg font-bold text-orange-700">
                  Stok menipis
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {menipis.length > 0
                    ? `${menipis.length} produk memiliki stok 5 atau kurang.`
                    : "Semua produk memiliki stok di atas batas minimum."}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 ring-1 ring-orange-200">
              {menipis.length} produk perlu dicek
            </div>
          </div>

          {menipis.length === 0 ? (
            <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
              ✓ Stok aman. Tidak ada produk yang menipis.
            </div>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {menipis.map((produk) => (
                <li
                  key={produk.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-orange-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg">
                      📦
                    </div>
                    <span className="truncate text-sm font-semibold text-slate-700">
                      {produk.nama}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      produk.stok === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {produk.stok === 0
                      ? "Habis"
                      : `Sisa ${produk.stok}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ),
    },
  ];

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Selamat datang di
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#4A2A12] sm:text-4xl">
            Ringkasan
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Pantau aktivitas toko Anda hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {tanggalID(sekarang)}
            </p>
            <p className="text-xs text-slate-500">
              Pukul {waktuID(sekarang)} WIB
            </p>
          </div>
        </div>
      </header>

      {/* Kartu statistik dan peringatan stok */}
      <DismissibleSections sections={sections} />

      {/* Grafik dan transaksi terbaru */}
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Penjualan 7 Hari Terakhir
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {tanggalID(awalMinggu)} – {tanggalID(sekarang)}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Total omzet
              </p>
              <p className="mt-1 font-bold text-orange-600">
                {rp(totalOmzetMinggu)}
              </p>
            </div>
          </div>

          <div className="mt-6 w-full">
            <svg
              viewBox="0 0 600 190"
              role="img"
              aria-label="Grafik omzet tujuh hari terakhir"
              className="h-auto w-full overflow-visible"
            >
              {[30, 68, 106, 145].map((y, i) => (
                <g key={y}>
                  <line
                    x1="28"
                    y1={y}
                    x2="572"
                    y2={y}
                    stroke="#E8E8E8"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="22"
                    y={y + 4}
                    textAnchor="end"
                    fill="#94A3B8"
                    fontSize="10"
                  >
                    {i === 3
                      ? "0"
                      : rp(Math.round((nilaiMaksimum * (3 - i)) / 3))}
                  </text>
                </g>
              ))}

              {grafik.map((hari, i) => {
                const x = 28 + i * (544 / 6);
                const tinggi = (hari.omzet / nilaiMaksimum) * 115;

                return (
                  <rect
                    key={kunciTanggal(hari.tanggal)}
                    x={x - 11}
                    y={145 - tinggi}
                    width="22"
                    height={Math.max(tinggi, 0)}
                    rx="5"
                    fill="#FDBA74"
                    opacity="0.65"
                  />
                );
              })}

              <polyline
                points={titikGrafik}
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {grafik.map((hari, i) => {
                const x = 28 + i * (544 / 6);
                const y = 145 - (hari.omzet / nilaiMaksimum) * 115;

                return (
                  <g key={kunciTanggal(hari.tanggal)}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#F97316"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y="165"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="11"
                    >
                      {hari.hari}
                    </text>
                    <text
                      x={x}
                      y="181"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="10"
                    >
                      {hari.tanggal.getDate()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <span className="h-3 w-3 rounded-full bg-orange-500" />
            Omzet penjualan
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Transaksi Terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Aktivitas penjualan terakhir
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
              {transaksiTerbaru.length} transaksi
            </span>
          </div>

          {transaksiTerbaru.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
              <p className="text-3xl">🧾</p>
              <p className="mt-3 font-semibold text-slate-700">
                Belum ada transaksi
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Transaksi yang tercatat akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-orange-50/70 text-xs text-slate-500">
                    <th className="rounded-l-lg px-3 py-3 font-semibold">
                      Waktu
                    </th>
                    <th className="px-3 py-3 font-semibold">
                      Kode
                    </th>
                    <th className="rounded-r-lg px-3 py-3 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiTerbaru.map((trx) => (
                    <tr
                      key={String(trx.id)}
                      className="border-b border-slate-100 last:border-0 hover:bg-orange-50/40"
                    >
                      <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                        <p className="font-medium">
                          {tanggalID(new Date(trx.tanggal))}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {waktuID(new Date(trx.tanggal))}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 font-medium text-slate-700">
                        TRX-{String(trx.id).slice(-6).toUpperCase()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right font-bold text-orange-600">
                        {rp(Number(trx.total ?? 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
