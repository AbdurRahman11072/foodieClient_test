'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Meal, MealsTableProps } from '@/types/meals';
import {
  CheckCircle,
  Clock,
  Copy,
  Eye,
  Flame,
  Pencil,
  Ruler,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { MealDetailsSheet } from './meals-sheet';

export function MealsTable({
  meals,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleAvailability,
  onView,
}: MealsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  console.log(meals);

  const handleViewDetails = (meal: Meal) => {
    setSelectedMeal(meal);
    setSheetOpen(true);
    onView?.(meal);
  };

  const handleEditClick = (meal: Meal) => {
    onEdit?.(meal);
  };

  // Helper to get category badge colors with dark mode support
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

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRFT: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
      PUBLISHED:
        'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      ARCHIVED:
        'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return colors[status] || colors.DRFT;
  };

  // Format price to USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <>
      <div className="w-full">
        <div className="rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[60px] font-medium text-foreground">
                  Image
                </TableHead>
                <TableHead className="font-medium text-foreground">
                  Meal Info
                </TableHead>
                <TableHead className="font-medium text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Nutritional
                </TableHead>
                <TableHead className="text-right font-medium text-foreground">
                  Price
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Rating
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Availability
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Last Updated
                </TableHead>
                <TableHead className="text-center font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meals?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No meals found.
                  </TableCell>
                </TableRow>
              ) : (
                meals?.map((meal) => (
                  <TableRow
                    key={meal.id}
                    className={cn(
                      'border-b border-border transition-colors',
                      hoveredRow === meal.id && 'bg-muted/50'
                    )}
                    onMouseEnter={() => setHoveredRow(meal.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Image */}
                    <TableCell>
                      <Avatar className="h-12 w-12 rounded-lg border border-border">
                        <AvatarImage src={meal.coverImg} alt={meal.name} />
                        <AvatarFallback className="rounded-lg bg-muted text-xs text-muted-foreground">
                          {meal.name?.slice(0, 2).toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* Meal Info */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground">
                          {meal.name}
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground">
                          {meal.description}
                        </div>
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {meal.ingredients
                              .slice(0, 3)
                              .map((ingredient, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            {meal.ingredients.length > 3 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                +{meal.ingredients.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Category - FIXED: Changed catagory to categories */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {meal?.categories?.slice(0, 2).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className={cn(
                              'px-2 py-0 text-[11px] font-normal',
                              getCategoryColor(cat)
                            )}
                          >
                            {cat}
                          </Badge>
                        ))}
                        {meal.categories && meal.categories.length > 2 && (
                          <Badge
                            variant="outline"
                            className="border-border bg-muted px-2 py-0 text-[11px] font-normal text-muted-foreground"
                          >
                            +{meal.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Nutritional Info */}
                    <TableCell>
                      <div className="space-y-1 text-center">
                        {meal.calories && (
                          <div className="flex items-center justify-center gap-1 text-xs">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-foreground">
                              {meal.calories}
                            </span>
                            <span className="text-muted-foreground">cal</span>
                          </div>
                        )}
                        {meal.servingSize && (
                          <div className="flex items-center justify-center gap-1 text-xs">
                            <Ruler className="h-3 w-3 text-blue-500" />
                            <span className="text-muted-foreground">
                              {meal.servingSize}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Price - FIXED: Uncommented price display */}
                    <TableCell className="text-right">
                      <div className="font-semibold text-foreground">
                        {formatPrice(meal.price)}
                      </div>
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-semibold text-foreground">
                          {meal.rating?.toFixed(1) || '0.0'}
                        </span>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    </TableCell>

                    {/* Status (DRFT/PUBLISHED/ARCHIVED) */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'px-2 py-0 text-[11px] font-medium capitalize',
                          getStatusColor(meal.status || 'DRFT')
                        )}
                      >
                        {meal.status?.toLowerCase() || 'draft'}
                      </Badge>
                    </TableCell>

                    {/* Availability */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'px-2 py-0 text-[11px] font-medium',
                          meal.available
                            ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                            : 'border-border bg-muted text-muted-foreground'
                        )}
                      >
                        {meal.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>

                    {/* Last Updated */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDate(meal.updatedAt || meal.createdAt)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(meal)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(meal)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Edit Meal"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDuplicate?.(meal)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Duplicate Meal"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleAvailability?.(meal)}
                          className={cn(
                            'h-8 w-8 p-0',
                            meal.available
                              ? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                              : 'text-muted-foreground hover:bg-emerald-100 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                          )}
                          title={
                            meal.available
                              ? 'Mark Unavailable'
                              : 'Mark Available'
                          }
                        >
                          {meal.available ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(meal)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="Delete Meal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Sheet */}
      <MealDetailsSheet
        meal={selectedMeal}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEdit={onEdit}
        onToggleAvailability={onToggleAvailability}
      />
    </>
  );
}
