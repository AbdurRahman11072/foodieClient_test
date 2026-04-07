// meals-sheet.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Meal } from '@/types/meals';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Flame,
  Package,
  Pencil,
  Scale,
  Star,
  Tag,
  XCircle,
} from 'lucide-react';

interface MealDetailsSheetProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (meal: Meal) => void;
  onToggleAvailability?: (meal: Meal) => void;
}

export function MealDetailsSheet({
  meal,
  open,
  onOpenChange,
  onEdit,
  onToggleAvailability,
}: MealDetailsSheetProps) {
  if (!meal) return null;

  // Helper to get category badge colors with dark mode
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Breakfast:
        'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      Lunch:
        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      Dinner:
        'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      Dessert:
        'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      Drink:
        'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
      Appetizer:
        'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    };
    return colors[category] || 'bg-muted text-muted-foreground border-border';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-l border-border bg-background p-0 sm:max-w-lg">
        <ScrollArea className="h-full">
          <div className="pb-10">
            {/* Cover Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={meal.coverImg}
                alt={meal.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge
                className={cn(
                  'absolute left-4 top-4 border-0 px-2 py-0.5 text-xs font-medium',
                  meal.available
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted-foreground text-white'
                )}
              >
                {meal.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            <div className="px-6 py-4">
              {/* Header */}
              <SheetHeader className="mb-4 text-left">
                <SheetTitle className="text-2xl font-semibold text-foreground">
                  {meal.name}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  {meal.description}
                </SheetDescription>
              </SheetHeader>

              {/* Price and Rating */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(meal.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">
                      {meal.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    <span>{meal.calories} cal</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Categories */}
              <div className="py-4">
                <div className="mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    Categories
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meal.catagory?.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className={cn(
                        'px-2 py-1 text-xs font-normal',
                        getCategoryColor(cat)
                      )}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Serving Info */}
              <div className="py-4">
                <div className="mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    Serving Size
                  </h3>
                </div>
                <p className="text-foreground">{meal.servingSize}</p>
              </div>

              <Separator className="bg-border" />

              {/* Ingredients */}
              <div className="py-4">
                <div className="mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    Ingredients
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients?.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="secondary"
                      className="bg-muted text-foreground"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Allergens */}
              {meal.allergens?.length > 0 && (
                <>
                  <div className="py-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-medium text-foreground">
                        Allergens
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meal.allergens.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator className="bg-border" />
                </>
              )}

              {/* Timestamps */}
              <div className="py-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    Timeline
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Created: {formatDate(meal.createdAt)}</p>
                  <p>Last updated: {formatDate(meal.updatedAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {onEdit && (
                  <Button
                    onClick={() => {
                      onOpenChange(false);
                      onEdit(meal);
                    }}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Meal
                  </Button>
                )}
                {onToggleAvailability && (
                  <Button
                    onClick={() => {
                      onToggleAvailability(meal);
                      onOpenChange(false);
                    }}
                    variant="outline"
                    className={cn(
                      'flex-1',
                      meal.available
                        ? 'text-destructive hover:bg-destructive/10'
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    )}
                  >
                    {meal.available ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark Unavailable
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Available
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
