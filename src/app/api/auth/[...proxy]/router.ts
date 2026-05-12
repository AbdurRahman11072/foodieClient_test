import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!.replace(/\/$/, "");

// Forward every /api/auth/* request to the backend, server-to-server
export async function POST(
  req: NextRequest,
  { params }: { params: { proxy: string[] } },
) {
  return proxyToBackend(req, params.proxy);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { proxy: string[] } },
) {
  return proxyToBackend(req, params.proxy);
}

async function proxyToBackend(req: NextRequest, segments: string[]) {
  const path = segments.join("/");
  const url = `${BACKEND_URL}/api/auth/${path}`;

  const headers = new Headers(req.headers);
  // Forward the cookie from the browser to the backend
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const res = await fetch(url, {
    method: req.method,
    headers,
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
    // server-to-server: no credentials mode needed
  });

  const resHeaders = new Headers(res.headers);

  // Rewrite Set-Cookie domain so it applies to the frontend domain
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    // Strip the Domain attribute so cookie applies to current host
    const rewritten = setCookie
      .replace(/;\s*Domain=[^;]+/gi, "")
      .replace(/;\s*Partitioned/gi, "") // not needed for same-site
      .replace(/SameSite=None/gi, "SameSite=Lax"); // can use Lax now, same origin
    resHeaders.set("set-cookie", rewritten);
  }

  return new Response(res.body, {
    status: res.status,
    headers: resHeaders,
  });
}
