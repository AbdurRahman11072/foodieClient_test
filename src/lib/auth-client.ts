import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? undefined : process.env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient()],
});
