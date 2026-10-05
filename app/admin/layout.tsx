import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logout } from "../login/actions";
import { NAMA_TOKO } from "@/lib/config";

const menu = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/barang", label: "Data Barang" },
  { href: "/admin/member", label: "Data Member" },
  { href: "/admin/user", label: "Akun Admin & Kasir" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/kasir");

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2F3B4A] md:flex">
      <aside className="md:w-56 bg-[#4A6A8A] text-white p-4 space-y-6">
        <div>
          <p className="font-bold text-lg">{NAMA_TOKO}</p>
          <p className="text-xs text-[#DCE6F0]">Admin: {session.nama}</p>
        </div>
        <nav className="flex md:flex-col gap-2 text-sm flex-wrap">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="px-3 py-2 rounded-lg hover:bg-[#6B8CAE]"
            >
              {m.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button className="text-sm underline">Logout</button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}