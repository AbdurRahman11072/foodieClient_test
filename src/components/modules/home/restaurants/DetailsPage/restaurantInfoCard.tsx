// components/modules/home/restaurants/restaurant-info-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  Share2,
  ShoppingBag,
  Star,
  ThumbsUp,
  Truck,
  Users,
  Utensils,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface RestaurantInfoCardProps {
  restaurant: {
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
    meals: unknown[];
    reviews: unknown[];
  };
  averageRating: number;
}

export function RestaurantInfoCard({
  restaurant,
  averageRating,
}: RestaurantInfoCardProps) {
  const [isLiked, setIsLiked] = useState(false);


  const isOpenNow = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [openHour, openMinute] = restaurant.openingTime
      .split(':')
      .map(Number);
    const [closeHour, closeMinute] = restaurant.closingTime
      .split(':')
      .map(Number);

    const currentTotal = currentHour * 60 + currentMinute;
    const openTotal = openHour * 60 + openMinute;
    const closeTotal = closeHour * 60 + closeMinute;

    return currentTotal >= openTotal && currentTotal <= closeTotal;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed like' : 'Liked this restaurant');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
      <Card className="p-6 bg-background shadow-xl border-border">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-background border-4 border-border overflow-hidden shadow-lg">
              {restaurant.avatarImg ? (
                <Image
                  src={restaurant.avatarImg}
                  alt={restaurant.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl">
                  🍽️
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">
                      {averageRating.toFixed(1)}
                    </span>
                    <span>({restaurant.reviews.length} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {restaurant.openingTime} - {restaurant.closingTime}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Closed on {restaurant.offday}s</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className="gap-2"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${isLiked ? 'fill-current text-primary' : ''}`}
                  />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed line-clamp-2">
              {restaurant.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <Utensils className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold">{restaurant.meals.length}</p>
                <p className="text-xs text-muted-foreground">Menu Items</p>
              </div>
              <div className="text-center">
                <ShoppingBag className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Orders Served</p>
              </div>
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">
                  {isOpenNow() ? 'Open Now' : 'Closed'}
                </p>
                <p className="text-xs text-muted-foreground">Current Status</p>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold">
                  {restaurant.reviews.length}
                </p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
