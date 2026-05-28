import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "blog_app_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  email: string;
  role: "admin" | "blogger";
};

type SessionJWTPayload = SessionPayload & {
  iat: number;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing env var: SESSION_SECRET");
  }

  return secret;
}

function getSessionSecretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey(), {
      algorithms: ["HS256"],
    });

    const sessionPayload = payload as SessionJWTPayload;

    if (!sessionPayload.userId || !sessionPayload.email || !sessionPayload.role) {
      return null;
    }

    if (sessionPayload.role !== "admin" && sessionPayload.role !== "blogger") {
      return null;
    }

    return {
      userId: sessionPayload.userId,
      email: sessionPayload.email,
      role: sessionPayload.role,
    };
  } catch {
    return null;
  }
}
