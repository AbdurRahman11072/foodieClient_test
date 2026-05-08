import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Restaurant } from '@/types/restaurant';
import {
  CalendarOff,
  Clock,
  ExternalLink,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const formatTime = (time?: string | null) => {
  if (!time) return null;
  const [h, m] = time.split(':');
  const date = new Date();
  date.setHours(Number(h), Number(m));
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const MetaItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2.5 text-muted-foreground">
    <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8 shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-xs font-medium truncate">{label}</span>
  </div>
);

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const filledStars = Math.round(restaurant.rating ?? 0);
  const reviewCount = restaurant.reviews?.length ?? 0;
  const mealCount = restaurant.meals?.length ?? 0;

  return (
    <Card className="overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg dark:bg-card dark:backdrop-blur-xl h-[70vh] group">

      {/* ── Cover banner ── */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {restaurant.coverImg ? (
          <Image
            src={restaurant.coverImg}
            alt={`${restaurant.name} cover`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
            <Store className="w-14 h-14 text-primary/20" />
          </div>
        )}

        {/* Gradient scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status pill — top right */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={
              restaurant.banned
                ? 'border-destructive/50 text-destructive bg-background/90 backdrop-blur-sm shadow-sm'
                : 'border-green-500/40 text-green-600 dark:text-green-400 bg-background/90 backdrop-blur-sm shadow-sm'
            }
          >
            <span
              className={`mr-1.5 inline-block w-1.5 h-1.5 rounded-full ${
                restaurant.banned ? 'bg-destructive' : 'bg-green-500'
              }`}
            />
            {restaurant.banned ? 'Suspended' : 'Active'}
          </Badge>
        </div>

        {/* Suspended overlay */}
        {restaurant.banned && (
          <div className="absolute inset-0 bg-destructive/30 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white/90 font-bold text-xl tracking-widest uppercase drop-shadow-lg">
              Suspended
            </span>
          </div>
        )}
      </div>

      {/* Avatar — outside cover so overflow-hidden doesn't clip it */}
      <div className="relative px-5">
        <div className="absolute -top-15  left-5 z-10">
          <Avatar className="h-[6.75rem] w-[6.75rem] border-[3px] border-background shadow-lg ring-2 ring-border/20">
            <AvatarImage
              src={restaurant.avatarImg || ''}
              alt={restaurant.name}
              className="object-cover"
            />
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {restaurant.name?.charAt(0)?.toUpperCase() || 'R'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ── Body ── */}
      <CardContent className="pt-12 px-5 pb-5 space-y-4">

        {/* Name row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-snug truncate">
              {restaurant.name}
            </h3>

            {/* Star rating */}
            <div className="flex items-center gap-1 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < filledStars
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground/25 fill-muted-foreground/10'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                {restaurant.rating?.toFixed(1)} &middot; {reviewCount}{' '}
                {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 shrink-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/restaurants/${restaurant.id}`}>
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </Link>
          </Button>
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        <Separator className="bg-border/40" />

        {/* Meta grid */}
        <div className="grid grid-cols-1 gap-2.5">
          {restaurant.openingTime && restaurant.closingTime && (
            <MetaItem
              icon={Clock}
              label={`${formatTime(restaurant.openingTime)} – ${formatTime(restaurant.closingTime)}`}
            />
          )}
          {restaurant.offday && (
            <MetaItem icon={CalendarOff} label={`Closed on ${restaurant.offday}`} />
          )}
          {mealCount > 0 && (
            <MetaItem icon={UtensilsCrossed} label={`${mealCount} items on the menu`} />
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
