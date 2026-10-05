import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "../login/actions";
import KasirClient from "./KasirClient";

export default async function KasirPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "KASIR") redirect("/admin");

  const products = await prisma.product.findMany({ orderBy: { nama: "asc" } });

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#2F3B4A]">
      <header className="flex items-center justify-between bg-[#6B8CAE] text-white px-6 py-3">
        <h1 className="font-bold text-lg">Kasir</h1>
        <div className="flex items-center gap-4">
          <span>{session.nama}</span>
          <form action={logout}>
            <button className="underline">Logout</button>
          </form>
        </div>
      </header>
      <KasirClient products={products} />
    </main>
  );
}