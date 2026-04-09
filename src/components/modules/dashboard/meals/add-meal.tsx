'use client';

// Assuming you have this action
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { env } from '@/env';
import { categoryService } from '@/services/category.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Schema from the meal data
const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coverImg: z
    .union([z.instanceof(File), z.string().url()])
    .optional()
    .refine((val) => val !== undefined && val !== null, {
      message: 'Cover image is required',
    }),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  rating: z.number().min(0).max(5, 'Rating must be 0-5'),
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

export default function AddMealForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      coverImg: undefined,
      description: '',
      price: 0,
      rating: 0, // This is fine
      available: true, // This is fine
      ingredients: [],
      calories: 0,
      servingSize: '',
      categories: [],
    },
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategory();

        setCategories(response);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
      setValue('coverImg', file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      // Update form value
      setValue('categories', newSelection);
      return newSelection;
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.filter((id) => id !== categoryId);
      setValue('categories', newSelection);
      return newSelection;
    });
  };

  const onSubmit = async (data: MealFormData) => {
    setIsLoading(true);
    const toastId = toast.loading('Adding product...');

    try {
      // First upload the image
      const imageFile = new FormData();
      imageFile.append('coverImg', data.coverImg as File);

      const imageUploadResponse = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
        {
          method: 'POST',
          body: imageFile,
        }
      );

      const imageData = await imageUploadResponse.json();

      if (!imageData?.data) {
        throw new Error('Failed to upload image');
      }

      // Prepare product data
      const mealData = {
        name: data.name,
        coverImg: imageData.data,
        description: data.description,
        price: data.price,
        rating: data.rating,
        available: data.available,
        ingredients: data.ingredients,
        calories: data.calories,
        servingSize: data.servingSize,
        categories: selectedCategories,
      };

      console.log(mealData);

      // Submit product data
      // const result = await CreateMealAction(productData); // Assuming you have this action

      // if (!result.success) {
      //   throw new Error(result.message || 'Failed to add product');
      // }

      toast.success('Product added successfully!', { id: toastId });

      // Reset form
      reset();
      setSelectedCategories([]);
      setCoverImagePreview('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add product',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryNames = selectedCategories
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean);

  // Transform ingredients string to array
  const transformIngredients = (ingredientsStr: string) => {
    return ingredientsStr
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedCategories([]);
                setCoverImagePreview('');
              }}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              form="product-form"
              className=" text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                'Adding Product...'
              ) : (
                <span className="flex justify-center items-center gap-1">
                  <PlusCircle />
                  Add Product
                </span>
              )}
            </Button>
          </div>
        </div>

        <form
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">
                General Information
              </h2>
              <div className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Product Name</FieldLabel>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel>Product Description</FieldLabel>
                      <Textarea
                        placeholder="Enter product description"
                        rows={4}
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="ingredients"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Ingredients</FieldLabel>
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
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </Card>

            {/* Nutritional Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold -mb-2">
                Nutritional Information
              </h2>
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
                        aria-invalid={fieldState.invalid}
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
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <h2 className="text-lg font-semibold -mb-2">
                Pricing And Rating
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Base Price</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="rating"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Rating</FieldLabel>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="mt-4">
                <Controller
                  name="available"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel>Available</FieldLabel>
                    </div>
                  )}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Image and Category */}
          <div className="space-y-8">
            {/* Upload Image */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
              <div className="space-y-4">
                <Controller
                  name="coverImg"
                  control={control}
                  render={({ fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer block"
                        >
                          {coverImagePreview ? (
                            <div className="space-y-2">
                              <Image
                                src={coverImagePreview}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="max-h-32 mx-auto object-contain"
                              />
                              <p className="text-sm text-gray-500">
                                Click to change image
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-4xl mb-2">📷</div>
                              <p className="text-sm text-gray-500">
                                Click to upload image
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </Card>

            {/* Category */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Category</h2>
              <div className="space-y-4">
                {/* Selected Categories */}
                {selectedCategoryNames.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {selectedCategoryNames.map((name, idx) => (
                      <div
                        key={selectedCategories[idx]}
                        className="flex items-center justify-between bg-gray-100 dark:bg-white/5 p-3 gap-3 rounded-lg"
                      >
                        <span className="text-sm font-medium">{name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCategory(selectedCategories[idx])
                          }
                          className="text-gray-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Category Selection */}
                <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Loading categories...
                    </p>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                          id={`category-${category.id}`}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>

                {selectedCategories.length === 0 && errors.categories && (
                  <p className="text-sm text-red-500">
                    Select at least one category
                  </p>
                )}
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
