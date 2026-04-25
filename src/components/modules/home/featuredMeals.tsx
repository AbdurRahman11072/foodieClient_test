import { Button } from '@/components/ui/button';
import mealService from '@/services/meals.service';
import { Meal } from '@/types/meals';
import Link from 'next/link';
import { MealCard } from './meals/mealCard';

const FeaturedMeals = async () => {
  const allMeals = await mealService.featuredMeal();

  if (!allMeals.success) {
    return (
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Meals
            </h2>
            <p className="text-muted-foreground mt-2">{allMeals.message}</p>
          </div>
        </div>
      </section>
    );
  }

  const mealData = allMeals?.data?.data;

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Meals
            </h2>
            <p className="text-muted-foreground mt-2">
              Popular choices from our top restaurants
            </p>
          </div>
          <Link href="/meals">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mealData.map((meal: Meal) => (
            <MealCard
              key={meal.id}
              id={meal.id}
              name={meal.name}
              description={meal.description}
              price={meal.price}
              rating={meal.rating}
              image={meal.coverImg}
              categories={meal.categories}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
