import { NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/security";

export function ok<T>(data: T, status = 200) {
  return applySecurityHeaders(
    NextResponse.json(
      {
        success: true,
        data,
      },
      { status },
    ),
  );
}

export function fail(message: string, status = 400, details?: unknown) {
  return applySecurityHeaders(
    NextResponse.json(
      {
        success: false,
        error: {
          message,
          details,
        },
      },
      { status },
    ),
  );
}
