import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { tambahUser, ubahUser, hapusUser } from "./actions";

const kotak =
  "border border-[#DCE6F0] bg-white rounded-lg px-3 py-1.5 text-sm text-[#2F3B4A]";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const session = await getSession();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { nama: "asc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Akun Admin & Kasir</h1>

      {error && (
        <p className="bg-[#C4645A] text-white text-sm rounded-lg px-4 py-2">
          {error}
        </p>
      )}
      {ok && (
        <p className="bg-[#7FA88A] text-white text-sm rounded-lg px-4 py-2">
          {ok}
        </p>
      )}

      {/* Tambah akun */}
      <form
        action={tambahUser}
        className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 space-y-3"
      >
        <h2 className="font-semibold">Tambah akun baru</h2>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-[#7A8594]">Nama</label>
            <input name="nama" required className={kotak} />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">Username</label>
            <input name="username" required className={kotak} />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">Password</label>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className={kotak}
            />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">Role</label>
            <select name="role" defaultValue="KASIR" className={kotak}>
              <option value="KASIR">Kasir</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button className="bg-[#7FA88A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
            Tambah
          </button>
        </div>
      </form>

      {/* Daftar akun */}
      <div className="space-y-3">
        <p className="text-sm text-[#7A8594]">{users.length} akun terdaftar</p>

        {users.map((u) => {
          const diriSendiri = u.id === session?.userId;
          return (
            <div
              key={u.id}
              className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 space-y-2"
            >
              <p className="text-sm">
                <span className="font-semibold">@{u.username}</span>{" "}
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full text-white ${
                    u.role === "ADMIN" ? "bg-[#4A6A8A]" : "bg-[#D98B6A]"
                  }`}
                >
                  {u.role === "ADMIN" ? "Admin" : "Kasir"}
                </span>
                {diriSendiri && (
                  <span className="ml-2 text-xs text-[#7A8594]">(kamu)</span>
                )}
              </p>

              <div className="flex flex-wrap gap-3 items-end">
                <form
                  action={ubahUser}
                  className="flex flex-wrap gap-2 items-end"
                >
                  <input type="hidden" name="id" value={u.id} />
                  <div>
                    <label className="block text-xs text-[#7A8594]">Nama</label>
                    <input
                      name="nama"
                      defaultValue={u.nama}
                      required
                      className={kotak}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A8594]">Role</label>
                    <select name="role" defaultValue={u.role} className={kotak}>
                      <option value="KASIR">Kasir</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A8594]">
                      Password baru (opsional)
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Kosongkan jika tidak diganti"
                      className={kotak}
                    />
                  </div>
                  <button className="bg-[#6B8CAE] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                    Simpan
                  </button>
                </form>

                {!diriSendiri && (
                  <form action={hapusUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="bg-[#C4645A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                      Hapus
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}