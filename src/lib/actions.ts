// src/lib/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { SiteData } from "@/types";

// ─── Auth guard ───────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

// ─── PUBLIC: Fetch all site data ──────────────────────────────────────────────
export async function getSiteData(): Promise<SiteData> {
  const [settings, navLinks, hero, headerCtas] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: "global" } }),
    prisma.navLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.heroContent.findUnique({ where: { key: "main" } }),
    prisma.headerCta.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    settings: {
      logoText: settings?.logoText ?? "Imagica",
      logoIconUrl: settings?.logoIconUrl ?? null,
      backgroundImage: settings?.backgroundImage ?? null,
    },
    navLinks: navLinks.map((n) => ({
      id: n.id,
      label: n.label,
      href: n.href,
      order: n.order,
      isActive: n.isActive,
    })),
    hero: {
      eyebrowText: hero?.eyebrowText ?? "BUILD A NO-CODE AI APP IN MINUTES",
      headline: hero?.headline ?? "A new way to think and create with computers",
      inputPlaceholder: hero?.inputPlaceholder ?? "Enter your email",
      ctaButtonText: hero?.ctaButtonText ?? "Get Started",
      videoDemoText: hero?.videoDemoText ?? "Play Video Demo",
      videoDemoUrl: hero?.videoDemoUrl ?? "#",
    },
    headerCtas: headerCtas.map((c) => ({
      id: c.id,
      key: c.key,
      label: c.label,
      href: c.href,
      variant: c.variant,
      order: c.order,
    })),
  };
}

// ─── ADMIN: Update global settings ───────────────────────────────────────────
export async function updateSiteSettings(data: {
  logoText: string;
  backgroundImage: string;
  logoIconUrl?: string;
}) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { key: "global" },
    update: data,
    create: { key: "global", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ─── ADMIN: Update hero content ───────────────────────────────────────────────
export async function updateHeroContent(data: {
  eyebrowText: string;
  headline: string;
  inputPlaceholder: string;
  ctaButtonText: string;
  videoDemoText: string;
  videoDemoUrl: string;
}) {
  await requireAdmin();
  await prisma.heroContent.upsert({
    where: { key: "main" },
    update: data,
    create: { key: "main", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ─── ADMIN: Nav link CRUD ─────────────────────────────────────────────────────
export async function createNavLink(data: {
  label: string;
  href: string;
  order: number;
}) {
  await requireAdmin();
  const link = await prisma.navLink.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return link;
}

export async function updateNavLink(
  id: string,
  data: { label?: string; href?: string; order?: number; isActive?: boolean }
) {
  await requireAdmin();
  const link = await prisma.navLink.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return link;
}

export async function deleteNavLink(id: string) {
  await requireAdmin();
  await prisma.navLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ─── ADMIN: Header CTA update ─────────────────────────────────────────────────
export async function updateHeaderCta(
  key: string,
  data: { label?: string; href?: string; variant?: string }
) {
  await requireAdmin();
  await prisma.headerCta.upsert({
    where: { key },
    update: data,
    create: { key, label: data.label ?? key, href: data.href ?? "#", variant: data.variant ?? "outline" },
  });
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ─── ADMIN: Fetch all nav links (including inactive) ─────────────────────────
export async function getAllNavLinks() {
  await requireAdmin();
  return prisma.navLink.findMany({ orderBy: { order: "asc" } });
}
