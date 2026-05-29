import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ session: null }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    {
      session: {
        email: session.email,
        role: session.role,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
