'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  ExternalLink,
  Star,
  Store,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  createdAt?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'grid' | 'list';
  showActions?: boolean;
}

export default function RestaurantCard({
  restaurant,
  variant = 'grid',
  showActions = true,
}: RestaurantCardProps) {
  const {
    id,
    name,
    coverImg,
    avatarImg,
    description,
    openingTime,
    closingTime,
    offday,
    rating = 4.5,
    totalOrders = 1234,
    followers = 5678,
    isBanned = false,
  } = restaurant;

  const isOpen = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isOffDay = offday === today;

    return !isOffDay && currentTime >= openTime && currentTime <= closeTime;
  };

  const getStatusColor = () => {
    if (isBanned) return 'bg-red-500';
    return isOpen() ? 'bg-green-500' : 'bg-gray-500';
  };

  const getStatusText = () => {
    if (isBanned) return 'Banned';
    return isOpen() ? 'Open Now' : 'Closed';
  };

  if (variant === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="relative md:w-72 h-48 md:h-auto">
            <Image src={coverImg} alt={name} fill className="object-cover" />
            <div className="absolute top-3 left-3">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {avatarImg && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src={avatarImg}
                        alt={`${name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                      <Link href={`/restaurants/${id}`}>{name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={isOpen() ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`}
                        />
                        {getStatusText()}
                      </Badge>
                      {isBanned && <Badge variant="destructive">Banned</Badge>}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-muted-foreground text-xs">
                        {openingTime} - {closingTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Off Day</p>
                      <p className="text-muted-foreground text-xs">{offday}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="font-medium">Rating</p>
                      <p className="text-muted-foreground text-xs">
                        {rating} / 5
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Followers</p>
                      <p className="text-muted-foreground text-xs">
                        {followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {showActions && (
                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/restaurants/${id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={coverImg}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`gap-1.5 ${isBanned ? 'bg-red-500' : isOpen() ? 'bg-green-500' : 'bg-gray-500'}`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${getStatusColor()} animate-pulse`}
            />
            {getStatusText()}
          </Badge>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="gap-1 bg-black/50 backdrop-blur-sm text-white border-none"
          >
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            {rating}
          </Badge>
        </div>

        {/* Avatar Image */}
        {avatarImg && (
          <div className="absolute -bottom-6 left-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
              <Image
                src={avatarImg}
                alt={`${name} logo`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 pt-8">
        {/* Restaurant Name */}
        <Link href={`/restaurants/${id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {followers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {totalOrders.toLocaleString()} orders
            </span>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {openingTime} - {closingTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Closed on {offday}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="mt-4 flex gap-2">
            <Link href={`/restaurants/${id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Restaurant
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
