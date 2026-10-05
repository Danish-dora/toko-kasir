import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NAMA_TOKO } from "@/lib/config";
import PrintButton from "./PrintButton";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default async function StrukPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { kode } = await params;

  const trx = await prisma.transaksi.findUnique({
    where: { kode },
    include: {
      user: true,
      member: true,
      detail: { include: { product: true } },
    },
  });
  if (!trx) notFound();

  const tanggal = trx.tanggal.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-[#FAF6EE] flex flex-col items-center py-8 print:bg-white print:py-0">
      <div className="w-[80mm] bg-white p-4 text-sm text-black shadow print:shadow-none">
        <div className="text-center mb-3">
          <h1 className="font-bold text-base">{NAMA_TOKO}</h1>
          <p className="text-xs">Terima kasih sudah berbelanja</p>
        </div>

        <div className="text-xs space-y-0.5 border-y border-dashed border-black py-2">
          <p>No: {trx.kode}</p>
          <p>Tanggal: {tanggal}</p>
          <p>Kasir: {trx.user.nama}</p>
          {trx.member && (
            <p>
              Member: {trx.member.nama} ({trx.member.kodeMember})
            </p>
          )}
        </div>

        <div className="py-2 space-y-1">
          {trx.detail.map((d) => (
            <div key={d.id}>
              <p>{d.product.nama}</p>
              <div className="flex justify-between text-xs">
                <span>
                  {d.qty} x {rp(d.harga)}
                </span>
                <span>{rp(d.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black pt-2 space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{rp(trx.subtotal)}</span>
          </div>
          {trx.diskon > 0 && (
            <div className="flex justify-between">
              <span>Diskon member</span>
              <span>- {rp(trx.diskon)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{rp(trx.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bayar ({trx.metodeBayar})</span>
            <span>{rp(trx.uangDiterima ?? trx.total)}</span>
          </div>
          {trx.kembalian !== null && (
            <div className="flex justify-between">
              <span>Kembalian</span>
              <span>{rp(trx.kembalian)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-[80mm] flex gap-2 mt-4 print:hidden">
        <PrintButton />
        <Link
          href="/kasir"
          className="flex-1 text-center bg-[#D98B6A] text-white rounded-lg py-2 font-semibold"
        >
          Transaksi Baru
        </Link>
      </div>
    </main>
  );
}