import { prisma } from "@/lib/prisma";
import { tambahBarang, ubahBarang, hapusBarang } from "./actions";

const kotak =
  "border border-[#DCE6F0] bg-white rounded-lg px-3 py-1.5 text-sm text-[#2F3B4A]";

export default async function BarangPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const products = await prisma.product.findMany({ orderBy: { nama: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Data Barang</h1>

      {error && (
        <p className="bg-[#C4645A] text-white text-sm rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Tambah */}
      <form
        action={tambahBarang}
        className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 flex flex-wrap gap-2 items-end"
      >
        <div>
          <label className="block text-xs text-[#7A8594]">Nama</label>
          <input name="nama" required className={kotak} />
        </div>
        <div>
          <label className="block text-xs text-[#7A8594]">Harga</label>
          <input
            name="harga"
            type="number"
            min={0}
            required
            className={`${kotak} w-28`}
          />
        </div>
        <div>
          <label className="block text-xs text-[#7A8594]">Stok</label>
          <input
            name="stok"
            type="number"
            min={0}
            required
            className={`${kotak} w-24`}
          />
        </div>
        <div>
          <label className="block text-xs text-[#7A8594]">Kategori</label>
          <select name="kategori" className={kotak}>
            <option value="MAKANAN_BERAT">Makanan berat</option>
            <option value="MINUMAN">Minuman</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#7A8594]">
            Foto (JPG/PNG/WEBP, maks 2 MB)
          </label>
          <input
            name="gambar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={`${kotak} w-64`}
          />
        </div>
        <button className="bg-[#7FA88A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
          Tambah
        </button>
      </form>

      {/* Daftar */}
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 flex flex-wrap gap-4 items-end"
          >
            <div className="w-20 h-20 rounded-lg bg-[#DCE6F0] overflow-hidden flex items-center justify-center text-xs text-[#7A8594] text-center">
              {p.gambar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.gambar}
                  alt={p.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                "Belum ada foto"
              )}
            </div>

            <form action={ubahBarang} className="flex flex-wrap gap-2 items-end">
              <input type="hidden" name="id" value={p.id} />
              <div>
                <label className="block text-xs text-[#7A8594]">Nama</label>
                <input
                  name="nama"
                  defaultValue={p.nama}
                  required
                  className={kotak}
                />
              </div>
              <div>
                <label className="block text-xs text-[#7A8594]">Harga</label>
                <input
                  name="harga"
                  type="number"
                  min={0}
                  defaultValue={p.harga}
                  required
                  className={`${kotak} w-28`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#7A8594]">Stok</label>
                <input
                  name="stok"
                  type="number"
                  min={0}
                  defaultValue={p.stok}
                  required
                  className={`${kotak} w-24`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#7A8594]">Kategori</label>
                <select
                  name="kategori"
                  defaultValue={p.kategori}
                  className={kotak}
                >
                  <option value="MAKANAN_BERAT">Makanan berat</option>
                  <option value="MINUMAN">Minuman</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7A8594]">
                  {p.gambar ? "Ganti foto" : "Foto"}
                </label>
                <input
                  name="gambar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={`${kotak} w-64`}
                />
              </div>
              {p.gambar && (
                <label className="flex items-center gap-1 text-xs text-[#7A8594] pb-2">
                  <input type="checkbox" name="hapusFoto" />
                  Hapus foto
                </label>
              )}
              <button className="bg-[#6B8CAE] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                Simpan
              </button>
            </form>

            <form action={hapusBarang}>
              <input type="hidden" name="id" value={p.id} />
              <button className="bg-[#C4645A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                Hapus
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}