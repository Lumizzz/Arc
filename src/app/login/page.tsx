// src/app/login/page.tsx
// Redirects /login → /admin so the header Login button works
import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/admin");
}
