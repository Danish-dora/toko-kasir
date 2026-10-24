
import { prisma } from "@/lib/prisma";
import MemberClient from "./MemberClient";

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const [{ error, ok }, members] = await Promise.all([
    searchParams,
    prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <MemberClient
      members={members}
      error={error}
      ok={ok}
    />
  );
}
