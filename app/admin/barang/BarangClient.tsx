
"use client";

import { useMemo, useState } from "react";
import type { Product } from "@prisma/client";
import {
  tambahBarang,
  ubahBarang,
  hapusBarang,
} from "./actions";

const rupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

const field =
  "mt-1.5 w-full min-w-0 rounded-xl border border-[#E9E2D8] bg-white px-3.5 py-2.5 text-sm text-[#35271E] outline-none transition placeholder:text-[#B6AA9D] focus:border-[#FF6500] focus:ring-4 focus:ring-orange-100";

const label = "text-xs font-semibold text-[#77695D]";

type Props = {
  products: Product[];
  error?: string;
};

export default function BarangClient({ products, error }: Props) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("SEMUA");
  const [stokRendah, setStokRendah] = useState(false);

  const stokMenipis = products.filter(
    (p) => p.stok > 0 && p.stok <= 5
  ).length;

  const stokHabis = products.filter((p) => p.stok === 0).length;

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    return products.filter((p) => {
      const cocokNama = p.nama.toLowerCase().includes(kata);
      const cocokKategori =
        kategori === "SEMUA" || p.kategori === kategori;
      const cocokStok =
        !stokRendah || (p.stok >= 0 && p.stok <= 5);

      return cocokNama && cocokKategori && cocokStok;
    });
  }, [products, cari, kategori, stokRendah]);

  return (
    <div className="min-h-full space-y-6 pb-10 text-[#35271E]">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#A18E7B]">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#F15A24]">Data Barang</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Data Barang
          </h1>

          <p className="mt-1 text-sm text-[#928477]">
            Kelola produk, harga, foto, dan stok warung kamu.
          </p>
        </div>

        <a
          href="#tambah-barang"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#E95700] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Tambah Barang
        </a>
      </header>

      {/* Notifikasi */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold">Ada masalah</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Ringkasan */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
            📦
          </div>
          <div>
            <p className="text-sm text-[#928477]">Total produk</p>
            <p className="mt-1 text-2xl font-bold">
              {products.length}
              <span className="ml-1 text-sm font-medium text-[#928477]">
                barang
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStokRendah(!stokRendah)}
          className={`flex items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition ${
            stokRendah
              ? "border-amber-300 bg-amber-50"
              : "border-[#F0E7DB] bg-white hover:border-amber-200"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
            🟡
          </div>
          <div>
            <p className="text-sm text-[#928477]">Stok menipis (1–5)</p>
            <p className="mt-1 text-2xl font-bold">{stokMenipis}</p>
          </div>
          <span className="ml-auto text-xs font-semibold text-amber-700">
            {stokRendah ? "Lihat semua" : "Lihat"}
          </span>
        </button>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl">
            🚨
          </div>
          <div>
            <p className="text-sm text-[#928477]">Stok habis</p>
            <p className="mt-1 text-2xl font-bold">{stokHabis}</p>
          </div>
        </div>
      </section>

      {/* Form tambah */}
      <section
        id="tambah-barang"
        className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm"
      >
        <div className="border-b border-[#F2EAE0] bg-[#FFFCF6] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-xl">
              ✨
            </div>
            <div>
              <h2 className="font-bold">Tambah barang baru</h2>
              <p className="mt-0.5 text-xs text-[#928477]">
                Lengkapi informasi produk di bawah ini.
              </p>
            </div>
          </div>
        </div>

        <form
          action={tambahBarang}
          encType="multipart/form-data"
          className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5 sm:p-6"
        >
          <div>
            <label className={label}>Nama barang *</label>
            <input
              name="nama"
              required
              maxLength={100}
              placeholder="Contoh: Mie ayam"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Harga jual (Rp) *</label>
            <input
              name="harga"
              type="number"
              min={0}
              step={1}
              required
              placeholder="15000"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Stok awal *</label>
            <input
              name="stok"
              type="number"
              min={0}
              step={1}
              required
              placeholder="20"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Kategori *</label>
            <select name="kategori" defaultValue="MAKANAN_BERAT" className={field}>
              <option value="MAKANAN_BERAT">Makanan berat</option>
              <option value="MINUMAN">Minuman</option>
            </select>
          </div>

          <div>
            <label className={label}>Foto produk</label>
            <input
              name="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={`${field} cursor-pointer px-2 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-orange-50 file:px-2 file:py-1.5 file:font-semibold file:text-orange-700`}
            />
            <p className="mt-1.5 text-[11px] text-[#A18E7B]">
              JPG, PNG, WEBP · Maks. 2 MB
            </p>
          </div>

          <div className="flex items-end sm:col-span-2 xl:col-span-5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#E95700] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Simpan Barang Baru
            </button>
          </div>
        </form>
      </section>

      {/* Daftar produk */}
      <section className="overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#F2EAE0] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Daftar produk</h2>
              <p className="mt-1 text-sm text-[#928477]">
                {hasil.length} dari {products.length} produk ditampilkan
              </p>
            </div>

            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
              {kategori === "SEMUA"
                ? "Semua kategori"
                : kategori === "MINUMAN"
                  ? "Minuman"
                  : "Makanan berat"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#A18E7B]">
                ⌕
              </span>
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama barang..."
                aria-label="Cari nama barang"
                className={`${field} mt-0 py-3 pl-10`}
              />
            </div>

            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              aria-label="Filter kategori"
              className={`${field} mt-0 py-3`}
            >
              <option value="SEMUA">Semua kategori</option>
              <option value="MAKANAN_BERAT">Makanan berat</option>
              <option value="MINUMAN">Minuman</option>
            </select>
          </div>
        </div>

        {hasil.length === 0 ? (
          <div className="px-5 py-16 text-center sm:px-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF4E8] text-3xl">
              📦
            </div>
            <h3 className="mt-4 font-bold">Barang tidak ditemukan</h3>
            <p className="mt-1 text-sm text-[#928477]">
              Coba ubah kata pencarian atau filter kategori.
            </p>
            <button
              type="button"
              onClick={() => {
                setCari("");
                setKategori("SEMUA");
                setStokRendah(false);
              }}
              className="mt-4 text-sm font-bold text-[#F15A24] hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 bg-[#FFFEFC] p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {hasil.map((p) => {
              const habis = p.stok === 0;
              const menipis = p.stok > 0 && p.stok <= 5;

              return (
                <article
                  key={p.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#EFE7DD] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="relative h-44 overflow-hidden bg-[#F7F0E7]">
                    {p.gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.gambar}
                        alt={p.nama}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-[#B7A797]">
                        <span className="text-4xl">🍽️</span>
                        <span className="text-xs font-medium">
                          Belum ada foto produk
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm ${
                        p.kategori === "MINUMAN"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {p.kategori === "MINUMAN"
                        ? "🥤 Minuman"
                        : "🍛 Makanan berat"}
                    </span>
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="truncate font-bold text-[#35271E]" title={p.nama}>
                        {p.nama}
                      </h3>
                      <p className="mt-1.5 text-lg font-extrabold text-[#F15A24]">
                        {rupiah(p.harga)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#FFFAF4] px-3.5 py-3">
                      <span className="text-xs font-medium text-[#928477]">
                        Stok tersedia
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          habis
                            ? "bg-red-100 text-red-700"
                            : menipis
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {habis
                          ? "Habis"
                          : menipis
                            ? `Menipis · ${p.stok}`
                            : `${p.stok} unit`}
                      </span>
                    </div>

                    <details className="group/edit border-t border-[#F1E9DF] pt-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-1 py-2 text-sm font-bold text-[#79695B] transition hover:text-[#F15A24]">
                        <span>✎ Edit informasi barang</span>
                        <span className="transition group-open/edit:rotate-180">
                          ▾
                        </span>
                      </summary>

                      <form
                        action={ubahBarang}
                        encType="multipart/form-data"
                        className="mt-3 space-y-3"
                      >
                        <input type="hidden" name="id" value={p.id} />

                        <div>
                          <label className={label}>Nama barang</label>
                          <input
                            name="nama"
                            defaultValue={p.nama}
                            required
                            maxLength={100}
                            className={field}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={label}>Harga (Rp)</label>
                            <input
                              name="harga"
                              type="number"
                              min={0}
                              step={1}
                              defaultValue={p.harga}
                              required
                              className={field}
                            />
                          </div>
                          <div>
                            <label className={label}>Stok</label>
                            <input
                              name="stok"
                              type="number"
                              min={0}
                              step={1}
                              defaultValue={p.stok}
                              required
                              className={field}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={label}>Kategori</label>
                          <select
                            name="kategori"
                            defaultValue={p.kategori}
                            className={field}
                          >
                            <option value="MAKANAN_BERAT">
                              Makanan berat
                            </option>
                            <option value="MINUMAN">Minuman</option>
                          </select>
                        </div>

                        <div>
                          <label className={label}>Ganti foto</label>
                          <input
                            name="gambar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className={`${field} cursor-pointer px-2 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-orange-50 file:px-2 file:py-1.5 file:font-semibold file:text-orange-700`}
                          />
                          <p className="mt-1 text-[11px] text-[#A18E7B]">
                            Kosongkan jika foto tidak ingin diganti.
                          </p>
                        </div>

                        {p.gambar && (
                          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-100 bg-red-50/60 p-3 text-xs font-medium text-red-700">
                            <input
                              type="checkbox"
                              name="hapusFoto"
                              className="h-4 w-4 accent-red-600"
                            />
                            Hapus foto produk saat disimpan
                          </label>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[#6B8CAE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#54799E]"
                        >
                          Simpan Perubahan
                        </button>
                      </form>

                      <form
                        action={hapusBarang}
                        className="mt-3"
                        onSubmit={(e) => {
                          if (
                            !window.confirm(
                              `Yakin ingin menghapus barang "${p.nama}"?`
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                        >
                          🗑 Hapus Barang
                        </button>
                      </form>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="border-t border-[#F2EAE0] px-5 py-4 text-xs text-[#A18E7B] sm:px-6">
          Data barang Warung Kita · Perubahan tersimpan melalui database.
        </div>
      </section>
    </div>
  );
}
