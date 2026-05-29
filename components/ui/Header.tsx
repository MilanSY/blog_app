"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ViewerSession = {
  email: string;
  role: "admin" | "blogger";
};

export default function Header() {
  const router = useRouter();
  const [session, setSession] = useState<ViewerSession | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) {
            setSession(null);
          }
          return;
        }

        const payload = (await response.json()) as { session: ViewerSession | null };
        if (!cancelled) {
          setSession(payload.session);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setSession(null);
    router.refresh();
    router.push("/");
  }

  return (
    <header className="h-16 w-full bg-gray-800 text-white">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          Blog-APP
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          {session ? (
            <>
              {session.role === "blogger" ? <Link href="/blog/edit">Edit blog</Link> : null}
              {session.role === "admin" ? <Link href="/about/edit">Edit about</Link> : null}
              {session.role === "admin" ? <Link href="/moderation">Moderation</Link> : null}
              <span className="text-xs text-gray-300">{session.email}</span>
              <button type="button" onClick={handleLogout} className="cursor-pointer underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
