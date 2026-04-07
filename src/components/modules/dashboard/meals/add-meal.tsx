'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Schema from the meal data
const mealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coverImg: z.string().url('Invalid image URL'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  rating: z.number().min(0).max(5, 'Rating must be 0-5').default(0),
  available: z.boolean().default(true),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required'),
  allergens: z.string().optional(),
  calories: z.number().positive('Calories must be positive'),
  servingSize: z.string().min(1, 'Serving size required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface Category {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      coverImg: '',
      description: '',
      price: 0,
      rating: 0,
      available: true,
      ingredients: [],
      categories: [],
      calories: 0,
    },
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  const onSubmit = async (data: MealFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form Data:', { ...data, categories: selectedCategories });
      toast.success('Product added successfully!');
      reset();
      setSelectedCategories([]);
      setCoverImage('');
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryNames = selectedCategories
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean);

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
            <Button variant="outline" onClick={() => reset()}>
              Save Draft
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleSubmit(onSubmit)}
            >
              ✓ Add Product
            </Button>
          </div>
        </div>

        <form
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
                <Field>
                  <FieldLabel>Name Product</FieldLabel>
                  <Input
                    placeholder="Enter product name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Description Product</FieldLabel>
                  <Textarea
                    placeholder="Enter product description"
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <FieldError>{errors.description.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Ingredients</FieldLabel>
                  <Textarea
                    placeholder="List ingredients (comma separated)"
                    rows={3}
                    {...register('ingredients')}
                  />
                  {errors.ingredients && (
                    <FieldError>{errors.ingredients.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Allergens (Optional)</FieldLabel>
                  <Input
                    placeholder="List any allergens"
                    {...register('allergens')}
                  />
                </Field>
              </div>
            </Card>

            {/* Nutritional Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">
                Nutritional Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Calories</FieldLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register('calories', { valueAsNumber: true })}
                  />
                  {errors.calories && (
                    <FieldError>{errors.calories.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Serving Size</FieldLabel>
                  <Input
                    placeholder="e.g., 100g"
                    {...register('servingSize')}
                  />
                  {errors.servingSize && (
                    <FieldError>{errors.servingSize.message}</FieldError>
                  )}
                </Field>
              </div>
            </Card>

            {/* Pricing And Stock */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Pricing And Stock</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Base Pricing</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      {...register('price', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.price && (
                    <FieldError>{errors.price.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Rating</FieldLabel>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="0"
                    {...register('rating', { valueAsNumber: true })}
                  />
                  {errors.rating && (
                    <FieldError>{errors.rating.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Controller
                    name="available"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <FieldLabel>Available</FieldLabel>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Image and Category */}
          <div className="space-y-8">
            {/* Upload Image */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Upload Img</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    {coverImage ? (
                      <div className="w-full">
                        <Image
                          src={coverImage}
                          alt="Product preview"
                          width={200}
                          height={200}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm text-gray-500">
                          Click to upload image
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {errors.coverImg && (
                  <FieldError>{errors.coverImg.message}</FieldError>
                )}
              </div>
            </Card>

            {/* Category */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Category</h2>
              <div className="space-y-4">
                {/* Selected Categories */}
                {selectedCategoryNames.length > 0 && (
                  <div className="space-y-2">
                    {selectedCategoryNames.map((name, idx) => (
                      <div
                        key={selectedCategories[idx]}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                      >
                        <span className="text-sm font-medium">{name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCategory(selectedCategories[idx])
                          }
                          className="text-gray-400 hover:text-gray-600"
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

                {selectedCategories.length === 0 && (
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
