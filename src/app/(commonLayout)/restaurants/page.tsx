// app/(commonLayout)/restaurants/page.tsx
import Restaurants from '@/components/modules/home/restaurants/restaurant';
import restaurantService from '@/services/restaurant.service';

export default async function RestaurantsPage() {
  const restaurantData = await restaurantService.getAllRestaurants();
  const restaurants = restaurantData?.data || [];

  return <Restaurants restaurants={restaurants} />;
}
