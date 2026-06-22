import { NextRequest, NextResponse } from "next/server";

/**
 * S-06: Rate limiting on /api/auth/* to protect against brute-force
 * and credential stuffing attacks.
 *
 * File renamed from middleware.ts → proxy.ts per Next.js 16 convention.
 * Function renamed from `middleware` → `proxy` per Next.js 16 convention.
 *
 * In-memory store is used here for simplicity.
 * For production at scale, replace with Upstash Redis (@upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute sliding window
const MAX_REQUESTS = 10;  // max auth attempts per window per IP

function getRateLimitKey(req: NextRequest): string {
  // Prefer the real IP behind proxies/CDN
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function proxy(request: NextRequest) {
  // Only rate-limit auth endpoints
  if (!request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const key = getRateLimitKey(request);
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    // First request in this window — start tracking
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else if (entry.count >= MAX_REQUESTS) {
    // Window still active and limit exceeded
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  } else {
    // Within window, increment counter
    entry.count++;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
