import { redirect } from "next/navigation";
export default function LoginPage() {
  redirect("/admin");
}
```
Click **Commit** — this makes the Login button work.

---

**2 — Fix NEXTAUTH_URL in Vercel**

This is likely why admin login isn't working. Go to **Vercel → Settings → Environment Variables** → edit `NEXTAUTH_URL` and set it to your exact URL:
```
https://arc-bay-two.vercel.app
