'use client';

import { MealCard } from '@/components/modules/home/meals/mealCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoryService } from '@/services/category.service';
import mealService from '@/services/meals.service';
import { Meal } from '@/types/meals';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

const BrowseMealspage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    string | undefined
  >(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [categories, setCategories] = useState<
    { id: string; name: string; coverImg: string }[]
  >([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [initialLoading, setInitialLoading] = useState(true); // For initial featured meals load

  const [debouncedSearch] = useDebounce(search, 2000);
  const [debouncedCategory] = useDebounce(selectedCategories, 2000);
  const [debouncedPrice] = useDebounce(priceRange, 2000);

  // Fetch categories
  useEffect(() => {
    const category = async () => {
      try {
        const data = await categoryService.getAllCategory();
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    category();
  }, []);

  // Fetch initial featured meals
  useEffect(() => {
    const mealData = async () => {
      setInitialLoading(true);
      try {
        const data = await mealService.featuredMeal();
        setMeals(data.data.data);
      } catch (error) {
        console.error('Error fetching featured meals:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    mealData();
  }, []);

  // Fetch filtered meals
  useEffect(() => {
    const mealData = async () => {
      setLoading(true);
      try {
        const data = await mealService.getAllMeals({
          search: debouncedSearch,
          category: debouncedCategory,
          price: debouncedPrice[1],
        });

        if (data.data.data.length === 0) {
          setMeals([]);
        } else {
          setMeals(data.data.data);
        }
      } catch (error) {
        console.error('Error fetching filtered meals:', error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    mealData();
  }, [debouncedSearch, debouncedPrice, debouncedCategory]);

  return (
    <section className="min-h-screen container mx-auto flex flex-col">
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Meals
          </h1>
          <p className="text-muted-foreground">
            Find exactly what you're craving
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Search meals..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {/* Show typing indicator */}
                  {search && search !== debouncedSearch && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Searching...
                    </p>
                  )}
                </div>

                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Cuisine
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategories(undefined)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        !selectedCategories
                          ? 'bg-primary text-white'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      All Cuisines
                    </button>
                    {categories.map((cuisine) => (
                      <button
                        key={cuisine.id}
                        onClick={() => setSelectedCategories(cuisine.name)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategories === cuisine.name
                            ? 'bg-primary text-white'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {cuisine.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${priceRange[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">to</span>
                      <span className="text-sm font-medium">
                        ${priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Reset */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategories(undefined);
                    setPriceRange([0, 50]);
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Meals Grid */}
            <div className="lg:col-span-4">
              {/* Loading State */}
              {loading || initialLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-lg text-muted-foreground mt-4">
                    Loading meals...
                  </p>
                </div>
              ) : meals.length === 0 ? (
                /* No Results State */
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No meals found
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearch('');
                      setSelectedCategories(undefined);
                      setPriceRange([0, 50]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                /* Results State */
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {meals.length} meal{meals.length !== 1 ? 's' : ''}
                    </p>
                    {(search || selectedCategories || priceRange[1] < 50) && (
                      <p className="text-xs text-muted-foreground">
                        Filtered results
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {meals.map((meal) => (
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseMealspage;
