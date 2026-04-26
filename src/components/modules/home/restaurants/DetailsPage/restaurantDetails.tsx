// components/modules/home/restaurants/restaurant-details.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Menu, MessageCircle, Utensils } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { MealCard } from '../../meals/mealCard';

import { RestaurantInfoCard } from './restaurantInfoCard';
import { ReviewsSection } from './reviewCard';

interface categoriesType {
  id: string;
  name: string;
}

interface Meal {
  id: string;
  name: string;
  coverImg: string;
  description: string;
  price: number;
  rating: number;
  categories: categoriesType[];
}

interface Review {
  id?: string;
  userName: string;
  rating: number;
  description: string;
  updatedAt: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  coverImg: string;
  avatarImg: string;
  rating: number;
  openingTime: string;
  closingTime: string;
  offday: string;
  createdAt: string;
  meals: Meal[];
  reviews: Review[];
}

interface RestaurantDetailsProps {
  restaurant: Restaurant;
}

export function RestaurantDetails({ restaurant }: RestaurantDetailsProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');

  const averageRating =
    restaurant.reviews.length > 0
      ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) /
        restaurant.reviews.length
      : restaurant.rating;

  const tabs = [
    { id: 'menu', label: 'Menu', icon: Menu, count: restaurant.meals.length },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: MessageCircle,
      count: restaurant.reviews.length,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-80 w-full overflow-hidden">
        {restaurant.coverImg ? (
          <Image
            src={restaurant.coverImg}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            <Utensils className="h-24 w-24 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Restaurant Info Card - Separate Component */}
      <RestaurantInfoCard
        restaurant={restaurant}
        averageRating={averageRating}
      />

      {/* Navbar-style Tab Menu */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200
                    border-b-2 relative whitespace-nowrap
                    ${
                      isActive
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <Badge
                      variant="secondary"
                      className={`
                        ml-1 px-1.5 py-0 text-xs rounded-full
                        ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                      `}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            {restaurant.meals.length === 0 ? (
              <Card className="p-12 text-center">
                <Utensils className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Menu Items Yet
                </h3>
                <p className="text-muted-foreground">
                  This restaurant hasn't added any menu items.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {restaurant.meals.map((meal) => (
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
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <ReviewsSection
            reviews={restaurant.reviews}
            restaurantName={restaurant.name}
          />
        )}
      </div>
    </main>
  );
}
