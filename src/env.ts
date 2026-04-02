import { createEnv } from '@t3-oss/env-nextjs';
import z from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BACKEND_BATTER_AUTH_URL: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z.string(),
    NEXT_PUBLIC_BACKEND_API_URL: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BACKEND_BATTER_AUTH_URL:
      process.env.NEXT_PUBLIC_BACKEND_BATTER_AUTH_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
