// src/app/page.tsx
import { getSiteData } from "@/lib/actions";
import { LandingPage } from "@/components/LandingPage";

// Revalidate every 60 seconds (ISR) — or remove for full SSR
export const revalidate = 60;

export default async function Home() {
  const siteData = await getSiteData();
  return <LandingPage data={siteData} />;
}
