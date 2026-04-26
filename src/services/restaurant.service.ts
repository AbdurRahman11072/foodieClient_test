import { env } from '@/env';

const restaurantService = {
  getAllRestaurants: async () => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants`);
      const data = await res.json();

      return data;
    } catch (error) {
      return { success: false, message: 'Something went wrong', data: [] };
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
