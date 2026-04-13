import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/middleware/rateLimiter";
import { applySecurityHeaders, enforceCors } from "@/lib/security";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const limit = checkRateLimit(request);
    if (!limit.allowed) {
      const blocked = NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many requests",
          },
        },
        { status: 429 },
      );
      blocked.headers.set("Retry-After", String(limit.retryAfter ?? 60));
      return enforceCors(request, applySecurityHeaders(blocked));
    }
  }

  if (
    request.method === "OPTIONS" &&
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return enforceCors(
      request,
      applySecurityHeaders(new NextResponse(null, { status: 204 })),
    );
  }

  const response = applySecurityHeaders(NextResponse.next());
  if (request.nextUrl.pathname.startsWith("/api")) {
    return enforceCors(request, response);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
