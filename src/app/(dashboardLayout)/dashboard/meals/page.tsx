// app/(dashboard)/dashboard/meals/page.tsx
import { MealsTable } from '@/components/modules/dashboard/meals/meals-table';
import mealService from '@/services/meals.service';
import { userSerivce } from '@/services/user.service';
import { SessionData } from '@/types/session';

const MealsPage = async () => {
  const session: SessionData = await userSerivce.getUserSession();

  const meals = await mealService.getAllMealByRestaurants(
    session?.user?.restaurantId,
    session.user.role
  );

  return (
    <MealsTable
      meals={meals.data}
      restaurantId={session?.user?.restaurantId as string}
    />
  );
};

export default MealsPage;
