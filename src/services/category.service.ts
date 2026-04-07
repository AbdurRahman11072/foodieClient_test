import { env } from '@/env';

export const categoryService = {
  getAllCategory: async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}category`, {
      next: { tags: ['AllCategory'] },
    });

    const data = await res.json();

    if (!res.ok) {
      return { message: data?.message };
    }
    console.log(data);

    return data.data;
  },
};
