import AddMealForm from '@/components/modules/dashboard/meals/add-meal';
import { userSerivce } from '@/services/user.service';

const AddMealPage = async () => {
  const userSession = await userSerivce.getUserSession();
  console.log(userSession.user.restaurantId);

  return <AddMealForm restaurantId={userSession.user.restaurantId} />;
};

export default AddMealPage;
