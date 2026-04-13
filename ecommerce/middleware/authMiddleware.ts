import { NextRequest } from "next/server";
import { verifyToken, type JwtPayload, type AppRole } from "@/lib/auth";

export function getAuthFromRequest(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    throw new Error("UNAUTHORIZED");
  }
  return auth;
}

export function requireRole(request: NextRequest, roles: AppRole[]) {
  const auth = requireAuth(request);
  if (!roles.includes(auth.role)) {
    throw new Error("FORBIDDEN");
  }
  return auth;
}
