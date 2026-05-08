// components/modules/home/restaurants/restaurant.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Flame, Search, Star, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { RestaurantCard } from './restaurantCard';

interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  coverImg: string;
  avatarImg: string;
  description: string;
  openingTime: string;
  closingTime: string;
  offday: string;
  rating: number;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    meals: number;
    orderItem: number;
  };
}

const SORT_OPTIONS = [
  { id: 'rating', label: 'Highest Rated', icon: Star },
  { id: 'meals', label: 'Most Meals', icon: Flame },
  { id: 'newest', label: 'Newest', icon: Clock },
];

import { Pagination } from '@/components/ui/pagination-custom';

interface RestaurantsProps {
  restaurants: Restaurant[];
  totalItems: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Restaurants({
  restaurants,
  totalItems,
  currentPage,
  limit,
  onPageChange,
}: RestaurantsProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [restaurants, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'meals':
          return b._count.meals - a._count.meals;
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [filtered, sortBy]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-12 md:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Restaurants & Providers
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the best restaurants and food providers near you
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="space-y-6 mb-10">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search restaurants by name or cuisine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-6 text-base bg-background border-border focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            {/* Sort */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                      sortBy === option.id
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Stats */}
          {sorted.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {sorted.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-foreground">
                  {totalItems}
                </span>{' '}
                restaurants
              </p>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {filtered.length !== restaurants.length &&
                  `${restaurants.length - filtered.length} filtered out`}
              </div>
            </div>
          )}

          {/* Results */}
          {sorted.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-foreground font-medium">
                No restaurants found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or clear the filters
              </p>
              {search && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearch('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    name={restaurant.name}
                    description={restaurant.description}
                    rating={restaurant.rating}
                    mealsCount={restaurant._count.meals}
                    ordersCount={restaurant._count.orderItem}
                    coverImg={restaurant.coverImg}
                    avatarImg={restaurant.avatarImg}
                    openingTime={restaurant.openingTime}
                    closingTime={restaurant.closingTime}
                    offday={restaurant.offday}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems / limit)}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
