import { env } from '@/env';

const mealService = {
  getAllMealByRestaurants: async (id: string) => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}meals/restaurant/${id}`,
      { cache: 'no-store', next: { tags: ['AllMeals'] } }
    );

    const data = await res.json();

    if (!res.ok) {
      return [];
    }
    return data?.data;
  },
};

export default mealService;
