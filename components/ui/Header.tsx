import Link from "next/link";

export default function Header() {
  return (
    <header className="h-16 w-full bg-gray-800 text-white">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          Blog-APP
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
