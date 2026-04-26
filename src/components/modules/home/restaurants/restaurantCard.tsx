// components/modules/home/restaurants/restaurantCard.tsx (Alternative)
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, ShoppingBag, Star, Utensils } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  mealsCount: number;
  ordersCount: number;
  coverImg: string;
  avatarImg: string;
  openingTime: string;
  closingTime: string;
  offday: string;
}

export function RestaurantCard({
  id,
  name,
  description,
  rating,
  mealsCount,
  ordersCount,
  coverImg,
  avatarImg,
  openingTime,
  closingTime,
  offday,
}: RestaurantCardProps) {
  const isOpenToday =
    offday !== new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-background">
      {/* Cover Image with Avatar Overlay */}
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={coverImg}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md z-10">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Open/Closed Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              className={
                isOpenToday
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }
            >
              {isOpenToday ? 'Open Today' : 'Closed Today'}
            </Badge>
          </div>
        </div>

        {/* Avatar - Positioned to overlap the cover image */}
        <div className="absolute -bottom-12 left-4 z-20">
          <div className="w-24 h-24 rounded-full bg-background border-2 border-border overflow-hidden shadow-md">
            <Image
              src={avatarImg}
              alt={name}
              width={200}
              height={200}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>

      <div className="p-4 pt-8">
        {/* Restaurant Name */}
        <h3 className="font-bold text-xl text-foreground mb-1 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 h-10">
          {description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <Utensils className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{mealsCount}</span>
            <span className="text-xs">meals</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{ordersCount}</span>
            <span className="text-xs">orders</span>
          </div>
        </div>

        {/* Hours */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {openingTime} - {closingTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Closed on {offday}s</span>
          </div>
        </div>

        {/* View Menu Button */}
        <Link href={`/restaurants/${id}`} className="w-full block">
          <Button
            variant="outline"
            className="w-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-200 group-hover:border-primary"
          >
            View Menu
            <Utensils className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
