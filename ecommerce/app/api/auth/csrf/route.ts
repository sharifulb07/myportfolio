import { NextRequest } from "next/server";
import { ok } from "@/utils/apiResponse";
import { createCsrfToken } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  const csrf = createCsrfToken();
  const response = ok({ csrfToken: csrf });
  response.cookies.set("csrf_token", csrf, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
