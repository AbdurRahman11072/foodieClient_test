// components/modules/dashboard/meals/meals-table-header.tsx
'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function MealsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
        <TableHead className="w-[60px] font-medium text-foreground">
          Image
        </TableHead>
        <TableHead className="w-[250px] font-medium text-foreground">
          Meal Info
        </TableHead>
        <TableHead className="font-medium text-foreground">Category</TableHead>
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
  );
}
