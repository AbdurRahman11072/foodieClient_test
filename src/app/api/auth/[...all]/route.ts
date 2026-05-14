import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // e.g. https://foodie-backend-bqoa.onrender.com
  
  // Construct the target URL on the backend
  const targetPath = url.pathname.replace("/api/auth", "/api/auth"); // Should be same if backend mounted at /api/auth
  const targetUrl = new URL(targetPath + url.search, backendUrl);

  const headers = new Headers(request.headers);
  // Optional: Add/Modify headers if needed
  headers.set("Host", new URL(backendUrl as string).host);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.method === "POST" ? await request.blob() : undefined,
      cache: "no-store",
      // Redirects should be handled by the client
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    // Ensure CORS headers from backend are not conflicting or are updated
    responseHeaders.delete("access-control-allow-origin");
    responseHeaders.delete("access-control-allow-credentials");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Auth Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
