// src/components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // basePath tells next-auth client to use our non-bracket API route
  return (
    <SessionProvider basePath="/api/auth/nextauth">
      {children}
    </SessionProvider>
  );
}
