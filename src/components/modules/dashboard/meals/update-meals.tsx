'use client';

import { UpdateMealAction } from '@/actions/meal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { categoryService } from '@/services/category.service';
import { Meal } from '@/types/meals';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Package, Save, Tag, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coverImg: z.union([z.instanceof(File), z.string().url()]).optional(),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  available: z.boolean(),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required'),
  calories: z.number().positive('Calories must be positive'),
  servingSize: z.string().min(1, 'Serving size required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface Category {
  id: string;
  name: string;
  coverImg: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateMealSheetProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  onSuccess?: () => void;
}

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

export function UpdateMealSheet({
  meal,
  open,
  onOpenChange,
  restaurantId,
  onSuccess,
}: UpdateMealSheetProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      coverImg: undefined,
      description: '',
      price: 0,
      available: true,
      ingredients: [],
      calories: 0,
      servingSize: '',
      categories: [],
    },
  });

  // Initialize form when meal changes
  useEffect(() => {
    if (meal) {
      setCoverImagePreview(meal.coverImg);
      const categoryIds = meal.categories?.map((cat) => cat.id) || [];
      setSelectedCategories(categoryIds);
      reset({
        name: meal.name || '',
        coverImg: meal.coverImg || undefined,
        description: meal.description || '',
        price: meal.price || 0,
        available: meal.available ?? true,
        ingredients: meal.ingredients || [],
        calories: meal.calories || 0,
        servingSize: meal.servingSize || '',
        categories: categoryIds,
      });
    }
  }, [meal, reset]);

  // Fetch categories using your category service
  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return;

      setIsLoadingCategories(true);
      try {
        const response = await categoryService.getAllCategory();

        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setCategories([]);
          toast.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        toast.error('Failed to fetch categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
      setValue('coverImg', file);
      setIsImageChanged(true);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      setValue('categories', newSelection, { shouldDirty: true });
      return newSelection;
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.filter((id) => id !== categoryId);
      setValue('categories', newSelection, { shouldDirty: true });
      return newSelection;
    });
  };

  const transformIngredients = (ingredientsStr: string) => {
    return ingredientsStr
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i);
  };

  const onSubmit = async (data: MealFormData) => {
    if (!meal) {
      toast.error('Meal data is missing');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Updating meal...');

    try {
      let coverImageUrl = meal.coverImg;

      if (isImageChanged && data.coverImg instanceof File) {
        const formData = new FormData();
        formData.append('coverImg', data.coverImg);

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const uploadData = await uploadResponse.json();
        if (!uploadData?.data) throw new Error('Failed to upload image');
        coverImageUrl = uploadData.data;
      }

      // Format categories properly for Prisma - convert array of strings to connect format
      const categoriesForPrisma = {
        set: selectedCategories.map((categoryId) => ({ id: categoryId })),
      };

      const mealData = {
        name: data.name,
        coverImg: coverImageUrl,
        description: data.description,
        price: data.price,
        available: data.available,
        ingredients: data.ingredients,
        calories: data.calories,
        servingSize: data.servingSize,
        categories: categoriesForPrisma, // Send in the correct format
        status: meal.status,
      };

      // Call your update action with both mealData and meal.id
      const result = await UpdateMealAction(mealData, meal.id);
      if (!result.success) {
        return toast.error(result.message, { id: toastId });
      }

      toast.success('Meal updated successfully!', { id: toastId });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update meal',
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryDetails = selectedCategories
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean) as Category[];

  if (!meal) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-l border-border bg-background p-0 sm:max-w-2xl">
        <ScrollArea className="h-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pb-10">
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {coverImagePreview ? (
                  <>
                    <Image
                      src={coverImagePreview}
                      alt={meal.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label
                        htmlFor="edit-image-upload"
                        className="cursor-pointer bg-background/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium hover:bg-background transition-colors"
                      >
                        Change Image
                      </label>
                    </div>
                  </>
                ) : (
                  <label
                    htmlFor="edit-image-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-muted-foreground">
                      Click to upload image
                    </p>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-image-upload"
                />
                {isImageChanged && (
                  <Badge className="absolute bottom-4 right-4 bg-amber-500 text-white border-0">
                    New image pending
                  </Badge>
                )}
              </div>

              <div className="px-6 py-4">
                {/* Header */}
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="text-2xl font-semibold text-foreground">
                    Edit Meal
                  </SheetTitle>
                </SheetHeader>

                {/* Basic Info */}
                <div className="space-y-4">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Meal Name</FieldLabel>
                        <Input
                          placeholder="Enter meal name"
                          {...field}
                          className="bg-background"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                          placeholder="Describe the meal..."
                          rows={3}
                          {...field}
                          className="bg-background resize-none"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="price"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Price</FieldLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8 bg-background"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="available"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2 h-full pt-6">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="available"
                          />
                          <label
                            htmlFor="available"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Available for order
                          </label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6 bg-border" />

                {/* Nutritional Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Nutritional Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="calories"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Calories</FieldLabel>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className="bg-background"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="servingSize"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Serving Size</FieldLabel>
                          <Input
                            placeholder="e.g., 100g"
                            {...field}
                            className="bg-background"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6 bg-border" />

                {/* Ingredients */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Ingredients
                    </h3>
                  </div>
                  <Controller
                    name="ingredients"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Textarea
                          placeholder="List ingredients (comma separated)"
                          rows={3}
                          onChange={(e) => {
                            const ingredientsArray = transformIngredients(
                              e.target.value
                            );
                            field.onChange(ingredientsArray);
                          }}
                          onBlur={field.onBlur}
                          defaultValue={field.value?.join(', ')}
                          className="bg-background resize-none"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Separator className="my-6 bg-border" />

                {/* Categories */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Categories
                    </h3>
                  </div>

                  {selectedCategoryDetails.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCategoryDetails.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className={cn(
                            'px-2 py-1 text-xs font-normal gap-1',
                            getCategoryColor(category.name)
                          )}
                        >
                          {category.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="max-h-48 overflow-y-auto divide-y divide-border">
                      {isLoadingCategories ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Loading categories...
                          </div>
                        </div>
                      ) : categories.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                          No categories found.
                        </p>
                      ) : (
                        categories.map((category) => (
                          <label
                            key={category.id}
                            className={cn(
                              'flex items-center gap-3 p-3 cursor-pointer transition-colors',
                              selectedCategories.includes(category.id)
                                ? 'bg-primary/5'
                                : 'hover:bg-muted/50'
                            )}
                          >
                            <Checkbox
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() =>
                                handleCategoryToggle(category.id)
                              }
                            />
                            <span className="text-sm font-medium text-foreground flex-1">
                              {category.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {selectedCategories.length === 0 && errors.categories && (
                    <p className="text-sm text-destructive mt-2">
                      Select at least one category
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading || (!isDirty && !isImageChanged)}
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
