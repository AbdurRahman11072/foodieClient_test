import { env } from '@/env';

const restaurantService = {
  getAllMeal: async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants`);
    const data = await res.json();

    return data;
  },
};

export default restaurantService;
