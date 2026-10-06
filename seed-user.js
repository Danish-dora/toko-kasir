const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      nama: "Super Admin",
      username: "superadmin",
      password: "password123",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "budikasir" },
    update: {},
    create: {
      nama: "Budi Kasir",
      username: "budikasir",
      password: "password123",
      role: "KASIR",
    },
  });

  console.log("Akun berhasil dibuat!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });