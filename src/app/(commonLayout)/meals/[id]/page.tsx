import MealDetailsCard from '@/components/modules/home/meals/mealDetails';
import mealService from '@/services/meals.service';
import { userSerivce } from '@/services/user.service';
import Link from 'next/link';



const MealDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const mealData = await mealService.getMealDetailsById(id);
  const session = await userSerivce.getUserSession();

  // Check if data exists (different structure than before)
  if (!mealData?.data || mealData.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No Data found!</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please contact the developer
          </p>
          <Link href="/meals" className="text-primary mt-4 inline-block">
            Back to Meals
          </Link>
        </div>
      </div>
    );
  }

  // Pass the meal data directly (not as array)
  return <MealDetailsCard meal={mealData.data} session={session} />;
};

export default MealDetailPage;
