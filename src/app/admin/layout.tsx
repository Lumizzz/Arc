// src/app/admin/layout.tsx
// Layout for all /admin pages — middleware already handles auth redirect
// so we just render children here without a second auth check
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08080f] flex">
      {children}
    </div>
  );
}
