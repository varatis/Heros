"use client";

import { Suspense } from "react";
import LoginScreen from "./LoginScreen";

/**
 * Point d'entrée : enveloppe le vrai écran dans Suspense parce qu'il
 * utilise `useSearchParams()` (requis par Next.js 16 pour éviter un
 * bailout CSR pendant le prerender).
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
}
