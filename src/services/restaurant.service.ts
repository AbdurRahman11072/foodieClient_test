import { env } from '@/env';

const restaurantService = {
  getAllRestaurants: async (page: number = 1, limit: number = 10) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants?${params.toString()}`
      );
      const data = await res.json();

      if (!res.ok) {
        return { success: false, data: { data: [], total: 0 } };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
        data: { data: [], total: 0 },
      };
    }
  },
  featuredMeal: async () => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants/featured-meal`,
        {
          next: { revalidate: 43200 },
        }
      );
      const data = await res.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
        data: {
          data: [],
        },
      };
    }
  },
  getRestaurantById: async (id: string) => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants/${id}`
      );
      const data = await res.json();

      return data;
    } catch (error) {
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};

export default restaurantService;
