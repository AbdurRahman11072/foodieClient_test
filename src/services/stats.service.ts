import { env } from '@/env';
import { cookies } from 'next/headers';

const statsService = {
  getStats: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json();

      return data;
    } catch {
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};

export default statsService;
