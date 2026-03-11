// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashed = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@imagica.ai" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@imagica.ai",
      password: hashed,
      role: "SUPER_ADMIN",
    },
  });

  // Seed global settings
  await prisma.siteSettings.upsert({
    where: { key: "global" },
    update: {},
    create: {
      key: "global",
      logoText: "Imagica",
      backgroundImage: "radial-gradient(ellipse at 60% 40%, #1a1060 0%, #0a0a1a 60%, #000010 100%)",
    },
  });

  // Seed nav links
  const navItems = [
    { label: "Product", href: "#product", order: 1 },
    { label: "How it works", href: "#how-it-works", order: 2 },
    { label: "Features", href: "#features", order: 3 },
    { label: "Mission", href: "#mission", order: 4 },
    { label: "Company", href: "#company", order: 5 },
  ];
  for (const item of navItems) {
    await prisma.navLink.create({ data: item });
  }

  // Seed hero content
  await prisma.heroContent.upsert({
    where: { key: "main" },
    update: {},
    create: {
      key: "main",
      eyebrowText: "BUILD A NO-CODE AI APP IN MINUTES",
      headline: "A new way to think and create with computers",
      inputPlaceholder: "adamdriver@gmail.com",
      ctaButtonText: "Get Started",
      videoDemoText: "Play Video Demo",
      videoDemoUrl: "#demo",
    },
  });

  // Seed header CTAs
  await prisma.headerCta.upsert({
    where: { key: "enterprise" },
    update: {},
    create: { key: "enterprise", label: "Enterprise", href: "#enterprise", variant: "outline", order: 1 },
  });
  await prisma.headerCta.upsert({
    where: { key: "login" },
    update: {},
    create: { key: "login", label: "Login", href: "/login", variant: "solid", order: 2 },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
