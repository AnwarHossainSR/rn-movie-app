const prisma = require("./src/db");
const bcrypt = require("bcrypt");

async function seed() {
  // clear all tables (respecting FK constraints)
  await prisma.searchHistory.deleteMany();
  await prisma.savedMovie.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password", 10);
  await prisma.user.create({
    data: {
      email: "mahedisr@gmail.com",
      password: hashedPassword,
      name: "Test User",
    },
  });

  console.log("Database seeded");
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
