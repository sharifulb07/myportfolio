import { NextRequest } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 120;

export function checkRateLimit(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  current.count += 1;
  if (current.count > MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  store.set(key, current);
  return { allowed: true, remaining: MAX_REQUESTS - current.count };
}
