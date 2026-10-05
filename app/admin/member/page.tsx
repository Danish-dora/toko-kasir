import { prisma } from "@/lib/prisma";
import { tambahMember, ubahMember, hapusMember } from "./actions";

const kotak =
  "border border-[#DCE6F0] bg-white rounded-lg px-3 py-1.5 text-sm text-[#2F3B4A]";

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Data Member</h1>

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

      <form
        action={tambahMember}
        className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 space-y-3"
      >
        <h2 className="font-semibold">Daftarkan member baru</h2>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-[#7A8594]">Nama</label>
            <input name="nama" required className={kotak} />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">No. telp</label>
            <input name="telp" required className={kotak} />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">Email</label>
            <input name="email" className={kotak} />
          </div>
          <div>
            <label className="block text-xs text-[#7A8594]">Alamat</label>
            <input name="alamat" className={kotak} />
          </div>
          <button className="bg-[#7FA88A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
            Daftarkan
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-[#7A8594]">{members.length} member</p>

        {members.map((m) => (
          <div
            key={m.id}
            className="bg-[#FFFDF8] rounded-xl shadow-sm p-4 space-y-2"
          >
            <p className="text-sm font-semibold">{m.kodeMember}</p>

            <div className="flex flex-wrap gap-3 items-end">
              <form
                action={ubahMember}
                className="flex flex-wrap gap-2 items-end"
              >
                <input type="hidden" name="id" value={m.id} />
                <div>
                  <label className="block text-xs text-[#7A8594]">Nama</label>
                  <input
                    name="nama"
                    defaultValue={m.nama}
                    required
                    className={kotak}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#7A8594]">
                    No. telp
                  </label>
                  <input
                    name="telp"
                    defaultValue={m.telp}
                    required
                    className={kotak}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#7A8594]">Email</label>
                  <input
                    name="email"
                    defaultValue={m.email ?? ""}
                    className={kotak}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#7A8594]">Alamat</label>
                  <input
                    name="alamat"
                    defaultValue={m.alamat ?? ""}
                    className={kotak}
                  />
                </div>
                <button className="bg-[#6B8CAE] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                  Simpan
                </button>
              </form>

              <form action={hapusMember}>
                <input type="hidden" name="id" value={m.id} />
                <button className="bg-[#C4645A] text-white rounded-lg px-4 py-1.5 text-sm font-semibold">
                  Hapus
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}