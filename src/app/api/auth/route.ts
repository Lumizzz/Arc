// src/app/api/auth/route.ts
// Single route handler replacing [...nextauth] — works with GitHub web upload
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
