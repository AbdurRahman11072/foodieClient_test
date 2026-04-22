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

  featuredMeal: async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}meals`);
    const data = await res.json();

    return data;
  }, // Add pagination parameters to your API call
  getAllMeals: async ({
    search,
    category,
    price,
    page = 1,
    limit = 10,
  }: {
    search?: string;
    category?: string;
    price?: number;
    page?: number;
    limit?: number;
  }) => {
    // Build query parameters
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    if (category) {
      params.append('category', category);
    }
    if (price) params.append('price', price.toString());
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();

    console.log(queryString);

    const url = `${env.NEXT_PUBLIC_BACKEND_API_URL}meals${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  },
  getMealDetailsById: async (id: string) => {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}meals/${id}`);
    const data = await res.json();

    return data;
  },
};

export default mealService;
