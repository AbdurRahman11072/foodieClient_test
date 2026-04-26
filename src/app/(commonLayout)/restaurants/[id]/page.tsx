import { RestaurantDetails } from '@/components/modules/home/restaurants/DetailsPage/restaurantDetails';
import restaurantService from '@/services/restaurant.service';

const RestaurantDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const restaurant = await restaurantService.getRestaurantById(id);

  console.log(restaurant.data);

  return <RestaurantDetails restaurant={restaurant.data} />;
};

export default RestaurantDetailsPage;
