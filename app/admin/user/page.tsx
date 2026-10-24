
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import UserClient from "./UserClient";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const [{ error, ok }, session, users] = await Promise.all([
    searchParams,
    getSession(),
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { nama: "asc" }],
    }),
  ]);

  return (
    <UserClient
      users={users.map(({ id, nama, username, role }) => ({
        id,
        nama,
        username,
        role,
      }))}
      currentUserId={session?.userId ?? null}
      error={error}
      ok={ok}
    />
  );
}
