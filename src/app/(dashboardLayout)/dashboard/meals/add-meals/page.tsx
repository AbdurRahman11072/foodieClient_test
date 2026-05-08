import AddMealForm from '@/components/modules/dashboard/meals/add-meal';
import { userService } from '@/services/user.service';



const AddMealPage = async () => {
  const userSession = await userService.getUserSession();

  if (!userSession) return null;

  return <AddMealForm restaurantId={userSession.user.restaurantId} />;
};

export default AddMealPage;
