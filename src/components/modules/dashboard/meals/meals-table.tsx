// components/modules/dashboard/meals/meals-table.tsx
'use client';

import { Meal, MealsTableProps } from '@/types/meals';
import { useState } from 'react';
import { MealDetailsSheet } from './meals-sheet';

import { MealsTableBody } from './meal-table-body';
import { MealsTableHeader } from './meal-table-header';
import { UpdateMealSheet } from './update-meals';

interface ExtendedMealsTableProps extends MealsTableProps {
  restaurantId: string;
}

export function MealsTable({
  meals,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleAvailability,
  onView,
  restaurantId,
}: ExtendedMealsTableProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const handleViewDetails = (meal: Meal) => {
    setSelectedMeal(meal);
    setDetailsSheetOpen(true);
    onView?.(meal);
  };

  const handleEditClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setEditSheetOpen(true);
    onEdit?.(meal);
  };

  const handleEditSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="w-full">
        <div className="rounded-md border border-border bg-background">
          {/* Table */}
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <MealsTableHeader />
              <MealsTableBody
                meals={meals}
                onView={handleViewDetails}
                onEdit={handleEditClick}
                onDuplicate={onDuplicate}
                onToggleAvailability={onToggleAvailability}
                onDelete={onDelete}
              />
            </table>
          </div>
        </div>
      </div>

      {/* Details Sheet */}
      <MealDetailsSheet
        meal={selectedMeal}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        onEdit={(meal) => {
          setDetailsSheetOpen(false);
          handleEditClick(meal);
        }}
        onToggleAvailability={onToggleAvailability}
      />

      {/* Edit Sheet */}
      <UpdateMealSheet
        meal={selectedMeal}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        restaurantId={restaurantId}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
