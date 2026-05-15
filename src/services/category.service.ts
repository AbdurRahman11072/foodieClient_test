import { env } from '@/env';

export const categoryService = {
  getAllCategory: async () => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}category`, {
        next: { tags: ['AllCategory'] },
      });

      const data = await res.json();

      return data;
    } catch (error) {
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};
