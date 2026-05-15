import AddRestaurantForm from '@/components/modules/home/restaurants/restaurantForm';
import { userService } from '@/services/user.service';



const CreateRestaurant = async () => {
  const session = await userService.getUserSession();

  return <AddRestaurantForm ownerId={session?.user?.id} />;
};

export default CreateRestaurant;
