import { env } from '@/env';

const mealService = {
  getAllMealByRestaurants: async (id: string | null, role: string) => {
    const url =
      role === 'admin'
        ? `${env.NEXT_PUBLIC_BACKEND_API_URL}meals` // get all meals
        : `${env.NEXT_PUBLIC_BACKEND_API_URL}meals/restaurant/${id}`; // get meals by restaurant id
    const res = await fetch(url, {
      cache: 'no-store',
      next: { tags: ['AllMeals'] },
    });

    const data = await res.json();

    if (!res.ok) {
      return [];
    }
    return data?.data;
  },
};

export default mealService;
