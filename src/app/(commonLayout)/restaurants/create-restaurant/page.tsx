import AddRestaurantForm from '@/components/modules/home/restaurants/restaurantForm';
import { userSerivce } from '@/services/user.service';



const CreateRestaurant = async () => {
  const session = await userSerivce.getUserSession();

  return <AddRestaurantForm ownerId={session?.user?.id} />;
};

export default CreateRestaurant;
