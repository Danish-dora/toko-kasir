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
  <div className="min-h-screen bg-[#FFFCF5] text-[#4A2A12] md:flex">
    <Sidebar namaToko={NAMA_TOKO} namaUser={session.nama} />

    <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 md:px-6 md:pt-6 xl:px-8">
      {children}
    </main>
  </div>
);
}