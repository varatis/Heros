"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginScreen from "@/app/login/LoginScreen";

/**
 * /register — ancienne route : redirection vers /login?mode=signup.
 * On rend directement LoginScreen pendant la redirection pour éviter
 * tout flash blanc.
 */
function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", "signup");
    const redirectTo = searchParams.get("redirectTo");
    if (redirectTo) params.set("redirectTo", redirectTo);
    if (searchParams.get("confirmed") === "1") params.set("confirmed", "1");

    router.replace(`/login?${params.toString()}`);
  }, [router, searchParams]);

  return <LoginScreen />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterRedirect />
    </Suspense>
  );
}
