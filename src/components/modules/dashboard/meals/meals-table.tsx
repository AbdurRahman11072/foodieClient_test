// components/modules/dashboard/meals/meals-table.tsx
'use client';

import { Meal, MealsTableProps } from '@/types/meals';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination-custom';
import { MealDetailsSheet } from './meals-sheet';

import { MealsTableBody } from './meal-table-body';
import { MealsTableHeader } from './meal-table-header';
import { UpdateMealSheet } from './update-meals';

interface ExtendedMealsTableProps extends MealsTableProps {
  restaurantId: string;
  totalItems: number;
  currentPage: number;
  limit: number;
}

export function MealsTable({
  meals,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleAvailability,
  onView,
  restaurantId,
  totalItems,
  currentPage,
  limit,
}: ExtendedMealsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalItems / limit);

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

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
