// src/app/api/auth/nextauth/route.ts
//
// NOTE: This file intentionally lives at /api/auth/nextauth
// instead of /api/auth/[...nextauth] to avoid GitHub web UI
// upload issues with bracket characters in folder names.
// The NEXTAUTH_URL and authOptions are configured to match.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
