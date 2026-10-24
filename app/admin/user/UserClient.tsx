
"use client";

import { useMemo, useState } from "react";
import type { Role } from "@prisma/client";
import { tambahUser, ubahUser, hapusUser } from "./actions";

type UserItem = {
  id: number;
  nama: string;
  username: string;
  role: Role;
};

type Props = {
  users: UserItem[];
  currentUserId: number | null;
  error?: string;
  ok?: string;
};

const field =
  "mt-1.5 w-full min-w-0 rounded-xl border border-[#E9E2D8] bg-white px-3.5 py-2.5 text-sm text-[#35271E] outline-none transition placeholder:text-[#B6AA9D] focus:border-[#FF6500] focus:ring-4 focus:ring-orange-100";

const label = "text-xs font-semibold text-[#77695D]";

export default function UserClient({
  users,
  currentUserId,
  error,
  ok,
}: Props) {
  const [cari, setCari] = useState("");

  const totalAdmin = users.filter((u) => u.role === "ADMIN").length;
  const totalKasir = users.filter((u) => u.role === "KASIR").length;

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    return users.filter((u) =>
      [u.nama, u.username, u.role].some((v) =>
        v.toLowerCase().includes(kata)
      )
    );
  }, [users, cari]);

  return (
    <div className="min-h-full space-y-6 pb-10 text-[#35271E]">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#A18E7B]">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#F15A24]">Akun Admin & Kasir</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Akun Admin & Kasir
          </h1>

          <p className="mt-1 text-sm text-[#928477]">
            Kelola pengguna dan atur akses sistem Warung Kita.
          </p>
        </div>

        <a
          href="#tambah-akun"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#E95700] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Tambah Akun
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
            <p className="font-bold">Terjadi kesalahan</p>
            <p className="mt-1 break-words">{error}</p>
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
            <p className="text-sm text-[#928477]">Total akun</p>
            <p className="mt-1 text-2xl font-bold">{users.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
            🛡️
          </div>
          <div>
            <p className="text-sm text-[#928477]">Administrator</p>
            <p className="mt-1 text-2xl font-bold">{totalAdmin}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#F0E7DB] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
            🧾
          </div>
          <div>
            <p className="text-sm text-[#928477]">Kasir</p>
            <p className="mt-1 text-2xl font-bold">{totalKasir}</p>
          </div>
        </div>
      </section>

      {/* Tambah akun */}
      <section
        id="tambah-akun"
        className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm"
      >
        <div className="border-b border-[#F2EAE0] bg-[#FFFCF6] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-xl">
              ✨
            </div>
            <div>
              <h2 className="font-bold">Tambah akun baru</h2>
              <p className="mt-0.5 text-xs text-[#928477]">
                Buat akun untuk administrator atau petugas kasir.
              </p>
            </div>
          </div>
        </div>

        <form
          action={tambahUser}
          className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-6"
        >
          <div>
            <label className={label}>Nama lengkap *</label>
            <input
              name="nama"
              required
              maxLength={100}
              placeholder="Nama pengguna"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Username *</label>
            <input
              name="username"
              required
              maxLength={50}
              autoComplete="username"
              placeholder="username"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Password *</label>
            <input
              name="password"
              type="password"
              minLength={6}
              maxLength={128}
              required
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
              className={field}
            />
          </div>

          <div>
            <label className={label}>Role akses *</label>
            <select name="role" defaultValue="KASIR" className={field}>
              <option value="KASIR">Kasir</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="sm:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6500] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#E95700] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Buat Akun
            </button>
          </div>
        </form>
      </section>

      {/* Daftar akun */}
      <section className="overflow-hidden rounded-2xl border border-[#F0E7DB] bg-white shadow-sm">
        <div className="space-y-4 border-b border-[#F2EAE0] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Daftar pengguna</h2>
              <p className="mt-1 text-sm text-[#928477]">
                {hasil.length} dari {users.length} akun ditampilkan
              </p>
            </div>

            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
              Pengelolaan akses
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#A18E7B]">
              ⌕
            </span>
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama, username, atau role..."
              aria-label="Cari akun"
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
              {users.length === 0
                ? "Belum ada akun"
                : "Akun tidak ditemukan"}
            </h3>
            <p className="mt-1 text-sm text-[#928477]">
              {users.length === 0
                ? "Buat akun pengguna pertama melalui form di atas."
                : "Coba gunakan kata kunci pencarian yang lain."}
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
            {hasil.map((u) => {
              const diriSendiri = u.id === currentUserId;
              const admin = u.role === "ADMIN";

              return (
                <article
                  key={u.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-[#EFE7DD] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 border-b border-[#F1E9DF] bg-[#FFFCF6] p-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                        admin
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {u.nama.trim().charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold" title={u.nama}>
                        {u.nama}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#928477]">
                        @{u.username}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        admin
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {admin ? "ADMIN" : "KASIR"}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FFFCF6] p-3">
                      <div>
                        <p className="text-[11px] text-[#A18E7B]">
                          Username
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold">
                          @{u.username}
                        </p>
                      </div>
                      <span className="text-xl">
                        {admin ? "🛡️" : "🧾"}
                      </span>
                    </div>

                    {diriSendiri && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                        ✓ Ini akun yang sedang kamu gunakan
                      </div>
                    )}

                    <details className="group/edit border-t border-[#F1E9DF] pt-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-1 py-2 text-sm font-bold text-[#79695B] transition hover:text-[#F15A24]">
                        <span>✎ Kelola akun</span>
                        <span className="transition group-open/edit:rotate-180">
                          ▾
                        </span>
                      </summary>

                      <form action={ubahUser} className="mt-3 space-y-3">
                        <input type="hidden" name="id" value={u.id} />

                        <div>
                          <label className={label}>Nama lengkap *</label>
                          <input
                            name="nama"
                            defaultValue={u.nama}
                            required
                            maxLength={100}
                            className={field}
                          />
                        </div>

                        <div>
                          <label className={label}>Role akses *</label>
                          <select
                            name="role"
                            defaultValue={u.role}
                            className={field}
                          >
                            <option value="KASIR">Kasir</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        <div>
                          <label className={label}>Password baru</label>
                          <input
                            name="password"
                            type="password"
                            minLength={6}
                            maxLength={128}
                            autoComplete="new-password"
                            placeholder="Kosongkan jika tidak diganti"
                            className={field}
                          />
                          <p className="mt-1.5 text-[11px] text-[#A18E7B]">
                            Minimal 6 karakter jika ingin mengganti password.
                          </p>
                        </div>

                        {diriSendiri && (
                          <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
                            Role akunmu akan tetap Admin.
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-[#6B8CAE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#54799E]"
                        >
                          Simpan Perubahan
                        </button>
                      </form>

                      {!diriSendiri && (
                        <form
                          action={hapusUser}
                          className="mt-3"
                          onSubmit={(e) => {
                            if (
                              !window.confirm(
                                `Yakin ingin menghapus akun @${u.username}?`
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={u.id} />
                          <button
                            type="submit"
                            className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                          >
                            🗑 Hapus Akun
                          </button>
                        </form>
                      )}
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="border-t border-[#F2EAE0] px-5 py-4 text-xs text-[#A18E7B] sm:px-6">
          Warung Kita · Pengaturan akun dan hak akses pengguna.
        </div>
      </section>
    </div>
  );
}
