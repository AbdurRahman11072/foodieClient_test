import { env } from '@/env';
import { cookies } from 'next/headers';

export const userSerivce = {
  getUserSession: async () => {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_BETTER_AUTH_URL}get-session`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: 'no-store',
      }
    );
    const session = await res.json();

    if (!session) {
      return null;
    }
    return session;
  },

  getAllUsers: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}users`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        next: { tags: ['AllUsers'] },
      });
      const data = await res.json();

      return data;
    } catch (error) {
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};
