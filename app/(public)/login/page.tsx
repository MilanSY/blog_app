import type { Metadata } from "next";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Login | Blog App",
  description: "Sign in to your Blog App account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function errorMessage(error?: string) {
  if (!error) {
    return null;
  }

  if (error === "missing_fields") {
    return "Please fill all fields.";
  }

  return "Invalid credentials.";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-gray-600">Access your account.</p>

      {errorMessage(error) ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage(error)}
        </p>
      ) : null}

      <form action={loginAction} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        No account yet? <Link href="/register" className="underline">Register</Link>
      </p>
    </main>
  );
}
