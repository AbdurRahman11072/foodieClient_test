'use client';

import { DeleteCategoryAction } from '@/actions/category';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteCategoryProps {
  categoryId: string;
  categoryName: string;
}

const DeleteCategory = ({
  categoryId,
  categoryName,
}: DeleteCategoryProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Deleting category...');

    try {
      const res = await DeleteCategoryAction(categoryId);

      if (!res.success) {
        return toast.error(res.message, { id: toastId });
      }

      setOpen(false);
      router.refresh();
      toast.success('Category deleted successfully', { id: toastId });
    } catch {
      toast.error('Error deleting category', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
              shadow-sm border border-gray-200 dark:border-gray-700
              transition-all duration-200
              
              transform group-hover:scale-100 scale-90 group/main"
          aria-label="Delete category"
        >
          <Trash2 className="w-4 h-4 transition-colors duration-200 group-hover/main:text-red " />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category
            <span className="font-semibold"> &quot;{categoryName}&quot;</span> and remove
            all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isLoading ? 'Deleting...' : 'Delete Category'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategory;
