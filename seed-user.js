const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {
      password,
      nama: "Super Admin",
      role: "ADMIN",
    },
    create: {
      nama: "Super Admin",
      username: "superadmin",
      password,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "budikasir" },
    update: {
      password,
      nama: "Budi Kasir",
      role: "KASIR",
    },
    create: {
      nama: "Budi Kasir",
      username: "budikasir",
      password,
      role: "KASIR",
    },
  });

  console.log("Akun berhasil dibuat/update!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });