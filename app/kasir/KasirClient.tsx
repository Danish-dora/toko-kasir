"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cariMember, daftarMember, checkout } from "./actions";
import { DISKON_MEMBER } from "@/lib/config";

type Product = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: "MAKANAN_BERAT" | "MINUMAN";
  gambar: string | null;
};

type CartItem = Product & { qty: number };

type MemberInfo = {
  id: number;
  nama: string;
  telp: string;
  kodeMember: string;
};

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

const tabs = [
  { key: "SEMUA", label: "Semua" },
  { key: "MAKANAN_BERAT", label: "Makanan" },
  { key: "MINUMAN", label: "Minuman" },
];

const input =
  "w-full border border-[#DCE6F0] bg-white rounded-lg px-3 py-1.5 text-sm text-[#2F3B4A]";

export default function KasirClient({ products }: { products: Product[] }) {
  const router = useRouter();

  const [tab, setTab] = useState("SEMUA");
  const [cari, setCari] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [telp, setTelp] = useState("");
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [pesanMember, setPesanMember] = useState("");
  const [showDaftar, setShowDaftar] = useState(false);
  const [fNama, setFNama] = useState("");
  const [fTelp, setFTelp] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fAlamat, setFAlamat] = useState("");

  const [metode, setMetode] = useState<"TUNAI" | "TRANSFER">("TUNAI");
  const [uang, setUang] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tampil = products.filter(
    (p) =>
      (tab === "SEMUA" || p.kategori === tab) &&
      p.nama.toLowerCase().includes(cari.toLowerCase())
  );

  function tambah(p: Product) {
    setCart((prev) => {
      const ada = prev.find((i) => i.id === p.id);
      if (ada) {
        if (ada.qty >= p.stok) return prev;
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      if (p.stok < 1) return prev;
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function ubahQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.min(i.qty + delta, i.stok) } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  const subtotal = cart.reduce((s, i) => s + i.harga * i.qty, 0);
  const diskon = member ? Math.round((subtotal * DISKON_MEMBER) / 100) : 0;
  const total = subtotal - diskon;
  const kembalian = Number(uang) - total;

  async function onCariMember() {
    setPesanMember("");
    const m = await cariMember(telp);
    if (m) {
      setMember(m);
    } else {
      setMember(null);
      setPesanMember("Member tidak ditemukan");
    }
  }

  async function onDaftarMember() {
    setPesanMember("");
    const res = await daftarMember({
      nama: fNama,
      telp: fTelp,
      email: fEmail,
      alamat: fAlamat,
    });
    if ("error" in res && res.error) {
      setPesanMember(res.error);
      return;
    }
    if ("member" in res && res.member) {
      setMember(res.member);
      setTelp(res.member.telp);
      setShowDaftar(false);
      setFNama("");
      setFTelp("");
      setFEmail("");
      setFAlamat("");
    }
  }

  async function bayar() {
    setError("");
    setLoading(true);
    const res = await checkout({
      items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
      memberId: member?.id ?? null,
      metodeBayar: metode,
      uangDiterima: metode === "TUNAI" ? Number(uang) : undefined,
    });
    setLoading(false);

    if ("error" in res) {
      setError(res.error);
      return;
    }
    router.push(`/struk/${res.kode}`);
  }

  const tidakBisaBayar =
    cart.length === 0 ||
    loading ||
    (metode === "TUNAI" && (uang === "" || Number(uang) < total));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Menu */}
      <section className="lg:col-span-2 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                tab === t.key
                  ? "bg-[#6B8CAE] text-white"
                  : "bg-[#DCE6F0] text-[#2F3B4A]"
              }`}
            >
              {t.label}
            </button>
          ))}
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari menu..."
            className="ml-auto border border-[#DCE6F0] bg-[#FFFDF8] rounded-lg px-3 py-1.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tampil.map((p) => (
            <button
              key={p.id}
              onClick={() => tambah(p)}
              disabled={p.stok < 1}
              className="text-left bg-[#FFFDF8] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition disabled:opacity-50"
            >
              <div className="aspect-square bg-[#DCE6F0] flex items-center justify-center text-[#7A8594] text-sm">
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
              <div className="p-3">
                <p className="font-semibold text-[#2F3B4A]">{p.nama}</p>
                <p className="text-[#D98B6A] font-bold">{rp(p.harga)}</p>
                <p className="text-xs text-[#7A8594]">
                  {p.stok < 1 ? "Stok habis" : `Stok: ${p.stok}`}
                </p>
              </div>
            </button>
          ))}
          {tampil.length === 0 && (
            <p className="col-span-full text-[#7A8594]">Menu tidak ditemukan.</p>
          )}
        </div>
      </section>

      {/* Keranjang */}
      <aside className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 h-fit space-y-4">
        <h2 className="font-bold text-[#2F3B4A]">Keranjang</h2>

        {cart.length === 0 && (
          <p className="text-sm text-[#7A8594]">Belum ada item.</p>
        )}

        <ul className="space-y-3">
          {cart.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-[#2F3B4A]">{i.nama}</p>
                <p className="text-xs text-[#7A8594]">{rp(i.harga)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => ubahQty(i.id, -1)}
                  className="w-7 h-7 rounded bg-[#DCE6F0]"
                >
                  -
                </button>
                <span className="w-5 text-center text-sm">{i.qty}</span>
                <button
                  onClick={() => ubahQty(i.id, 1)}
                  className="w-7 h-7 rounded bg-[#DCE6F0]"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Member */}
        <div className="border-t border-[#DCE6F0] pt-3 space-y-2">
          <p className="text-sm font-semibold text-[#2F3B4A]">Member</p>

          {member ? (
            <div className="flex items-center justify-between bg-[#DCE6F0] rounded-lg px-3 py-2 text-sm text-[#2F3B4A]">
              <span>
                {member.nama} ({member.kodeMember})
              </span>
              <button
                onClick={() => {
                  setMember(null);
                  setTelp("");
                }}
                className="underline"
              >
                Hapus
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={telp}
                  onChange={(e) => setTelp(e.target.value)}
                  placeholder="No. telp member"
                  className={input}
                />
                <button
                  onClick={onCariMember}
                  className="px-3 rounded-lg bg-[#6B8CAE] text-white text-sm"
                >
                  Cari
                </button>
              </div>
              <button
                onClick={() => setShowDaftar(!showDaftar)}
                className="text-sm underline text-[#4A6A8A]"
              >
                {showDaftar ? "Tutup form" : "Daftar member baru"}
              </button>
            </>
          )}

          {pesanMember && (
            <p className="text-sm text-[#C4645A]">{pesanMember}</p>
          )}

          {showDaftar && !member && (
            <div className="space-y-2">
              <input
                value={fNama}
                onChange={(e) => setFNama(e.target.value)}
                placeholder="Nama"
                className={input}
              />
              <input
                value={fTelp}
                onChange={(e) => setFTelp(e.target.value)}
                placeholder="No. telp"
                className={input}
              />
              <input
                value={fEmail}
                onChange={(e) => setFEmail(e.target.value)}
                placeholder="Email (opsional)"
                className={input}
              />
              <input
                value={fAlamat}
                onChange={(e) => setFAlamat(e.target.value)}
                placeholder="Alamat (opsional)"
                className={input}
              />
              <button
                onClick={onDaftarMember}
                className="w-full bg-[#7FA88A] text-white rounded-lg py-1.5 text-sm font-semibold"
              >
                Simpan member
              </button>
            </div>
          )}
        </div>

        {/* Ringkasan */}
        <div className="border-t border-[#DCE6F0] pt-3 space-y-1 text-sm text-[#2F3B4A]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{rp(subtotal)}</span>
          </div>
          {member && (
            <div className="flex justify-between text-[#7FA88A]">
              <span>Diskon member ({DISKON_MEMBER}%)</span>
              <span>- {rp(diskon)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{rp(total)}</span>
          </div>
        </div>

        {/* Pembayaran */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#2F3B4A]">Metode bayar</p>
          <div className="flex gap-2">
            {(["TUNAI", "TRANSFER"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetode(m)}
                className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${
                  metode === m
                    ? "bg-[#6B8CAE] text-white"
                    : "bg-[#DCE6F0] text-[#2F3B4A]"
                }`}
              >
                {m === "TUNAI" ? "Tunai" : "Transfer"}
              </button>
            ))}
          </div>

          {metode === "TUNAI" ? (
            <div className="space-y-1">
              <input
                type="number"
                value={uang}
                onChange={(e) => setUang(e.target.value)}
                placeholder="Uang diterima"
                className={input}
              />
              {uang !== "" && (
                <p className="text-sm text-[#2F3B4A]">
                  Kembalian:{" "}
                  <b>{kembalian >= 0 ? rp(kembalian) : "Uang kurang"}</b>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#7A8594]">
              Pastikan transfer sudah masuk sebelum klik Bayar.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-[#C4645A]">{error}</p>}

        <button
          onClick={bayar}
          disabled={tidakBisaBayar}
          className="w-full bg-[#D98B6A] text-white rounded-lg py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Bayar"}
        </button>
      </aside>
    </div>
  );
}