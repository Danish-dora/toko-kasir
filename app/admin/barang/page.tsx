
import { prisma } from "@/lib/prisma";
import BarangClient from "./BarangClient";

export default async function BarangPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, products] = await Promise.all([
    searchParams,
    prisma.product.findMany({
      orderBy: { nama: "asc" },
    }),
  ]);

  return <BarangClient products={products} error={error} />;
}
