'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Grid3x3, List, Search, Store } from 'lucide-react';
import { useState } from 'react';
import RestaurantCard from './restaurantCard';

interface Restaurant {
  id: string;
  name: string;
  coverImg: string;
  avatarImg?: string;
  description: string;
  openingTime: string;
  closingTime: string;
  offday: string;
  rating?: number;
  totalOrders?: number;
  followers?: number;
  isBanned?: boolean;
}

interface RestaurantGridProps {
  restaurants: Restaurant[];
  title?: string;
  subtitle?: string;
}

export default function RestaurantGrid({
  restaurants,
  title,
  subtitle,
}: RestaurantGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Store className="w-8 h-8" />
                {title}
              </h1>
            )}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {/* Search and Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Found {filteredRestaurants.length} restaurants
        </div>

        {/* Restaurant Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
