import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { NAMA_TOKO } from "@/lib/config";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/kasir");

  return (
    <div className="min-h-screen bg-[#FFFBDC] text-[#4A2A12] md:flex">
      <Sidebar namaToko={NAMA_TOKO} namaUser={session.nama} />
      <main className="min-w-0 flex-1 p-6 pt-16 md:pt-6">{children}</main>
    </div>
  );
}