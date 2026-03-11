// src/app/admin/dashboard/page.tsx
import { getToken } from "next-auth/jwt";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteData, getAllNavLinks } from "@/lib/actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function DashboardPage() {
  const [siteData, allNavLinks] = await Promise.all([
    getSiteData(),
    getAllNavLinks(),
  ]);

  return (
    <div className="min-h-screen bg-[#08080f] flex w-full">
      <AdminSidebar user={{ name: "Admin", email: "admin@imagica.ai" }} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <AdminDashboard siteData={siteData} allNavLinks={allNavLinks} />
      </main>
    </div>
  );
}
