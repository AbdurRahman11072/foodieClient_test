'use client';

import Restaurants from '@/components/modules/home/restaurants/restaurant';
import restaurantService from '@/services/restaurant.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RestaurantsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [restaurants, setRestaurants] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  const limit = 9;

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await restaurantService.getAllRestaurants(
          currentPage,
          limit
        );
        setRestaurants(response.data.data || []);
        setTotalItems(response.data.total || 0);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Restaurants
      restaurants={restaurants}
      totalItems={totalItems}
      currentPage={currentPage}
      limit={limit}
      onPageChange={handlePageChange}
    />
  );
}
