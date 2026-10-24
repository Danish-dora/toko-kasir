
"use client";

import { useMemo, useState } from "react";
import type { Member } from "@prisma/client";
import {
  tambahMember,
  ubahMember,
  hapusMember,
} from "./actions";

const field =
  "mt-1.5 w-full min-w-0 rounded-xl border border-[#E9E2D8] bg-white px-3.5 py-2.5 text-sm text-[#35271E] outline-none transition placeholder:text-[#B6AA9D] focus:border-[#FF6500] focus:ring-4 focus:ring-orange-100";

const label = "text-xs font-semibold text-[#77695D]";

type Props = {
  members: Member[];
  error?: string;
  ok?: string;
};

export default function MemberClient({
  members,
  error,
  ok,
}: Props) {
  const [cari, setCari] = useState("");

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    return members.filter((m) =>
      [
        m.kodeMember,
        m.nama,
        m.telp,
        m.email ?? "",
        m.alamat ?? "",
      ].some((nilai) => nilai.toLowerCase().includes(kata))
    );
  }, [members, cari]);

  const punyaEmail = members.filter((m) => m.email?.trim()).length;
  const punyaAlamat = members.filter((m) => m.alamat?.trim()).length;

  return (
    <div className="min-h-full space-y-6 pb-10 text-[#35271E]">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#A18E7B]">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#F15A24]">Data Member</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Data Member
          </h1>

          <p className="mt-1 text-sm text-[#928477]">
            Kelola data pelanggan dan keanggotaan Warung Kita.
          </p>
        </div>

        <a
          href="#daftar-member"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#E95700] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Daftarkan Member
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
            <p className="font-bold">Pendaftaran atau perubahan gagal</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {ok && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <span className="text-lg">✓</span>
          <div>
            <p className="font-bold">Berhasil!</p>
            <p className="mt-1">{ok}</p>
          </div>
        </div>
      )}

      {/* Statistik */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
            👥
          </div>
          <div>
            <p className="text-sm text-[#928477]">Total member</p>
            <p className="mt-1 text-2xl font-bold">
              {members.length}
              <span className="ml-1 text-sm font-medium text-[#928477]">
                orang
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
            ✉️
          </div>
          <div>
            <p className="text-sm text-[#928477]">Memiliki email</p>
            <p className="mt-1 text-2xl font-bold">{punyaEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
            📍
          </div>
          <div>
            <p className="text-sm text-[#928477]">Memiliki alamat</p>
            <p className="mt-1 text-2xl font-bold">{punyaAlamat}</p>
          </div>
        </div>
      </section>

      {/* Form pendaftaran */}
      <section
        id="daftar-member"
        className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm"
      >
        <div className="border-b border-[#F2EAE0] bg-[#FFFCF6] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-xl">
              ✨
            </div>
            <div>
              <h2 className="font-bold">Daftarkan member baru</h2>
              <p className="mt-0.5 text-xs text-[#928477]">
                Isi informasi pelanggan untuk membuat keanggotaan baru.
              </p>
            </div>
          </div>
        </div>

        <form
          action={tambahMember}
          className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-6"
        >
          <div>
            <label className={label}>Nama lengkap *</label>
            <input
              name="nama"
              required
              maxLength={100}
              placeholder="Contoh: Julian"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Nomor telepon *</label>
            <input
              name="telp"
              type="tel"
              required
              maxLength={30}
              placeholder="Contoh: 08123456789"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Email</label>
            <input
              name="email"
              type="text"
              maxLength={150}
              placeholder="nama@email.com"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Alamat</label>
            <input
              name="alamat"
              maxLength={250}
              placeholder="Kota atau alamat pelanggan"
              className={field}
            />
          </div>

          <div className="sm:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#E95700] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Daftarkan Member
            </button>
          </div>
        </form>
      </section>

      {/* Daftar member */}
      <section className="overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm">
        <div className="space-y-4 border-b border-[#F2EAE0] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Daftar pelanggan</h2>
              <p className="mt-1 text-sm text-[#928477]">
                {hasil.length} dari {members.length} member ditampilkan
              </p>
            </div>

            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
              Data keanggotaan
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#A18E7B]">
              ⌕
            </span>
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama, kode member, telepon, email, atau alamat..."
              aria-label="Cari member"
              className={`${field} mt-0 py-3 pl-10`}
            />
          </div>
        </div>

        {hasil.length === 0 ? (
          <div className="px-5 py-16 text-center sm:px-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF4E8] text-3xl">
              👥
            </div>
            <h3 className="mt-4 font-bold">
              {members.length === 0
                ? "Belum ada member"
                : "Member tidak ditemukan"}
            </h3>
            <p className="mt-1 text-sm text-[#928477]">
              {members.length === 0
                ? "Daftarkan pelanggan pertama Warung Kita melalui form di atas."
                : "Coba kata kunci lain atau periksa kembali pencarianmu."}
            </p>
            {cari && (
              <button
                type="button"
                onClick={() => setCari("")}
                className="mt-4 text-sm font-bold text-[#F15A24] hover:underline"
              >
                Reset pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 bg-[#FFFEFC] p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {hasil.map((m) => (
              <article
                key={m.id}
                className="group min-w-0 overflow-hidden rounded-2xl border border-[#EFE7DD] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3 border-b border-[#F1E9DF] bg-[#FFFCF6] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-700">
                    {m.nama.trim().charAt(0).toUpperCase() || "M"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="truncate font-bold"
                      title={m.nama}
                    >
                      {m.nama}
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#F15A24]">
                      {m.kodeMember}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    MEMBER
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-base">📞</span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#A18E7B]">
                        Nomor telepon
                      </p>
                      <p className="mt-0.5 break-words text-sm font-semibold">
                        {m.telp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-base">✉️</span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#A18E7B]">
                        Email
                      </p>
                      <p className="mt-0.5 break-words text-sm">
                        {m.email || "Belum diisi"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-base">📍</span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#A18E7B]">
                        Alamat
                      </p>
                      <p className="mt-0.5 break-words text-sm">
                        {m.alamat || "Belum diisi"}
                      </p>
                    </div>
                  </div>

                  <details className="group/edit border-t border-[#F1E9DF] pt-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-1 py-2 text-sm font-bold text-[#79695B] transition hover:text-[#F15A24]">
                      <span>✎ Edit data member</span>
                      <span className="transition group-open/edit:rotate-180">
                        ▾
                      </span>
                    </summary>

                    <form action={ubahMember} className="mt-3 space-y-3">
                      <input type="hidden" name="id" value={m.id} />

                      <div>
                        <label className={label}>Nama lengkap *</label>
                        <input
                          name="nama"
                          defaultValue={m.nama}
                          required
                          maxLength={100}
                          className={field}
                        />
                      </div>

                      <div>
                        <label className={label}>Nomor telepon *</label>
                        <input
                          name="telp"
                          type="tel"
                          defaultValue={m.telp}
                          required
                          maxLength={30}
                          className={field}
                        />
                      </div>

                      <div>
                        <label className={label}>Email</label>
                        <input
                          name="email"
                          type="text"
                          defaultValue={m.email ?? ""}
                          maxLength={150}
                          className={field}
                        />
                      </div>

                      <div>
                        <label className={label}>Alamat</label>
                        <input
                          name="alamat"
                          defaultValue={m.alamat ?? ""}
                          maxLength={250}
                          className={field}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#6B8CAE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#54799E]"
                      >
                        Simpan Perubahan
                      </button>
                    </form>

                    <form
                      action={hapusMember}
                      className="mt-3"
                      onSubmit={(e) => {
                        if (
                          !window.confirm(
                            `Yakin ingin menghapus member "${m.nama}" (${m.kodeMember})?`
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        🗑 Hapus Member
                      </button>
                    </form>
                  </details>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="border-t border-[#F2EAE0] px-5 py-4 text-xs text-[#A18E7B] sm:px-6">
          Data pelanggan Warung Kita · Informasi member tersimpan di database.
        </div>
      </section>
    </div>
  );
}
