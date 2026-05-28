import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getSession } from "@/lib/auth/session";

export default async function Header() {
    const session = await getSession();

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
              {session.role === "admin" ? <Link href="/admin/about/edit">Edit about</Link> : null}
              {session.role === "admin" ? <Link href="/admin/moderation">Moderation</Link> : null}
              <span className="text-xs text-gray-300">{session.email}</span>
              <form action={logoutAction}>
                <button type="submit" className="cursor-pointer underline">
                                    Logout
                                </button>
                            </form>
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
