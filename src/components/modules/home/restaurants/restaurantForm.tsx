'use client';

import { CreateRestaurntsAction } from '@/actions/restaurnat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { env } from '@/env';
import { restaurantSchema } from '@/schema/restaurant';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Store } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function AddRestaurantForm({ ownerId }: { ownerId: string }) {
  const router = useRouter();
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [avatarImagePreview, setAvatarImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      coverImg: undefined,
      avatarImg: undefined,
      description: '',
      openingTime: '',
      closingTime: '',
      offday: '',
    },
  });

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
      setValue('coverImg', file);
    }
  };

  const handleAvatarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarImagePreview(url);
      setValue('avatarImg', file);
    }
  };
  console.log(ownerId);
  const onSubmit = async (data: RestaurantFormData) => {
    setIsLoading(true);
    const toastId = toast.loading('Adding restaurant...');

    try {
      // Upload cover image
      const coverImageFile = new FormData();
      coverImageFile.append('coverImg', data.coverImg as File);

      const coverImageUploadResponse = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
        {
          method: 'POST',
          body: coverImageFile,
        }
      );

      const coverImageData = await coverImageUploadResponse.json();

      if (!coverImageData?.data) {
        throw new Error('Failed to upload cover image');
      }

      // Upload avatar image if provided
      let avatarImageUrl = coverImageData.data;
      if (data.avatarImg) {
        const avatarImageFile = new FormData();
        avatarImageFile.append('avatarImg', data.avatarImg as File);

        const avatarImageUploadResponse = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
          {
            method: 'POST',
            body: avatarImageFile,
          }
        );

        const avatarImageData = await avatarImageUploadResponse.json();

        if (avatarImageData?.data) {
          avatarImageUrl = avatarImageData.data;
        }
      }

      // Prepare restaurant data (ownerId will be added by the API)
      const restaurantData = {
        ownerId: ownerId,
        name: data.name,
        coverImg: coverImageData.data,
        avatarImg: avatarImageUrl,
        description: data.description,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        offday: data.offday,
      };

      console.log(restaurantData);

      // Submit restaurant data
      const result = await CreateRestaurntsAction(restaurantData);

      if (!result.success) {
        throw new Error(result.message || 'Failed to add restaurant');
      }

      toast.success('Restaurant added successfully!', { id: toastId });

      // Reset form
      router.push('/dashboard');
      reset();
      setCoverImagePreview('');
      setAvatarImagePreview('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add restaurant',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🍽️</div>
            <h1 className="text-3xl font-bold">Create New Restaurant</h1>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setCoverImagePreview('');
                setAvatarImagePreview('');
              }}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              form="restaurant-form"
              className="text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                'Adding Restaurant...'
              ) : (
                <span className="flex justify-center items-center gap-1">
                  <PlusCircle />
                  Add Restaurant
                </span>
              )}
            </Button>
          </div>
        </div>

        <form
          id="restaurant-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          {/* Cover Image Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cover Image</h2>
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
                        onChange={handleCoverImageUpload}
                        className="hidden"
                        id="cover-image-upload"
                      />
                      <label
                        htmlFor="cover-image-upload"
                        className="cursor-pointer block"
                      >
                        {coverImagePreview ? (
                          <div className="space-y-2">
                            <Image
                              src={coverImagePreview}
                              alt="Cover Preview"
                              width={200}
                              height={200}
                              className="max-h-32 mx-auto object-contain"
                            />
                            <p className="text-sm text-gray-500">
                              Click to change cover image
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-4xl mb-2">🏪</div>
                            <p className="text-sm text-gray-500">
                              Click to upload cover image
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Restaurant Name</FieldLabel>
                        <Input
                          placeholder="Enter restaurant name"
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
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                          placeholder="Enter restaurant description"
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
                </div>
              </Card>

              {/* Operating Hours */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Operating Hours</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="openingTime"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Opening Time</FieldLabel>
                        <Input
                          type="time"
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
                    name="closingTime"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Closing Time</FieldLabel>
                        <Input
                          type="time"
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

                <div className="mt-4">
                  <Controller
                    name="offday"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Off Day</FieldLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        >
                          <option value="">Select off day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </Card>
            </div>

            {/* Right Column - Avatar Image */}
            <div className="space-y-8">
              {/* Avatar Image */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Avatar Image</h2>
                <div className="space-y-4">
                  <Controller
                    name="avatarImg"
                    control={control}
                    render={({ fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarImageUpload}
                            className="hidden"
                            id="avatar-image-upload"
                          />
                          <label
                            htmlFor="avatar-image-upload"
                            className="cursor-pointer block"
                          >
                            {avatarImagePreview ? (
                              <div className="space-y-2">
                                <Image
                                  src={avatarImagePreview}
                                  alt="Avatar Preview"
                                  width={200}
                                  height={200}
                                  className="max-h-32 max-w-32 mx-auto object-contain "
                                />
                                <p className="text-sm text-gray-500">
                                  Click to change avatar image
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-4xl mb-2">👤</div>
                                <p className="text-sm text-gray-500">
                                  Click to upload avatar image
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

              {/* Info Card */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Store className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Restaurant Info</h2>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Owner ID will be automatically assigned by the API</p>
                  <p>• Opening and closing times in 24-hour format</p>
                  <p>• Select the weekly off day for the restaurant</p>
                  <p>• Cover image will be displayed on the restaurant card</p>
                  <p>• Avatar image is the restaurant logo/profile picture</p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
