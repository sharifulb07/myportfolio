import { NextRequest, NextResponse } from "next/server";
import { randomBytes, timingSafeEqual } from "crypto";

const SAFE_ORIGINS = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https://res.cloudinary.com data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self';",
  );
  return response;
}

export function enforceCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");
  if (origin && SAFE_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-CSRF-Token",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export function createCsrfToken() {
  return randomBytes(32).toString("hex");
}

export function verifyCsrfToken(
  cookieToken: string | undefined,
  headerToken: string | null,
) {
  if (!cookieToken || !headerToken) {
    return false;
  }

  try {
    const a = Buffer.from(cookieToken);
    const b = Buffer.from(headerToken);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
