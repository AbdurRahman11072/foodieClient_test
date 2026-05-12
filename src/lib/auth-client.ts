import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

const computedBaseURL =
  env.NEXT_PUBLIC_BACKEND_BETTER_AUTH_URL ||
  `${env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api/auth`;

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: computedBaseURL,
});
