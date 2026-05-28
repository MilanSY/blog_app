import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function errorMessage(error?: string) {
  if (!error) {
    return null;
  }

  if (error === "password_too_short") {
    return "Password must be at least 8 characters.";
  }

  if (error === "pseudo_unavailable") {
    return "Pseudo is already used.";
  }

  if (error === "missing_fields") {
    return "Please fill all fields.";
  }

  return "Registration failed.";
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold">Register</h1>
      <p className="mt-2 text-sm text-gray-600">Create a blogger account.</p>

      {errorMessage(error) ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage(error)}
        </p>
      ) : null}

      <form action={registerAction} className="mt-6 space-y-4">
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
          <span>Pseudo</span>
          <input
            name="pseudo"
            type="text"
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
            minLength={8}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
          Register
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link href="/login" className="underline">Login</Link>
      </p>
    </main>
  );
}
