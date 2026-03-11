// src/app/admin/dashboard/page.tsx
import { getSiteData, getAllNavLinks } from "@/lib/actions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function DashboardPage() {
  const [siteData, allNavLinks] = await Promise.all([
    getSiteData(),
    getAllNavLinks(),
  ]);

  return <AdminDashboard siteData={siteData} allNavLinks={allNavLinks} />;
}
