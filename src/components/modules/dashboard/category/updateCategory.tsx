'use client';

import { UpdateCategoryAction } from '@/actions/category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { env } from '@/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon, UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coverImg: z
    .union([z.instanceof(File), z.string().url()])
    .optional()
    .refine((val) => val !== undefined && val !== null, {
      message: 'Cover image is required',
    }),
});

const UpdateCategory = ({
  category,
}: {
  category: { id: string; name: string; coverImg: string };
}) => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string>(category.coverImg);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      coverImg: category.coverImg,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        coverImg: category.coverImg,
      });
      setPreviewUrl(category.coverImg);
      setIsImageChanged(false);
    }
  }, [open, category, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('coverImg', file);
      setIsImageChanged(true);
    }
  };

  const onSubmit = async (formData: z.infer<typeof categorySchema>) => {
    setIsLoading(true);
    const toastId = toast.loading('Updating category details');

    try {
      let coverImgUrl = formData.coverImg;

      // Only upload image if it was changed
      if (isImageChanged && formData.coverImg instanceof File) {
        const imageFile = new FormData();
        imageFile.append('coverImg', formData.coverImg);

        const imageUrl = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
          {
            method: 'POST',
            body: imageFile,
          }
        );
        const imgData = await imageUrl.json();
        coverImgUrl = imgData?.data;
        console.log(coverImgUrl);
      }

      const data = {
        name: formData.name as string,
        coverImg:
          typeof coverImgUrl === 'string' ? coverImgUrl : String(coverImgUrl),
      };

      const res = await UpdateCategoryAction(category.id as string, data);

      if (!res.success) {
        return toast.error(res.message, { id: toastId });
      }

      setOpen(false);
      router.refresh();
      toast.success('Category updated successfully', { id: toastId });
    } catch (error) {
      toast.error('Error updating category', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
    setPreviewUrl(category.coverImg);
    setIsImageChanged(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                    shadow-sm border border-gray-200 dark:border-gray-700
                    transition-all duration-200
                    hover:bg-primary hover:text-white hover:border-primary
                    transform group-hover:scale-100 scale-90"
          aria-label="Edit category"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold pb-2">
              Update Category
            </DialogTitle>
            <DialogDescription className="hidden">
              Update the food category details
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="coverImg"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Cover Image</FieldLabel>
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
                      {previewUrl ? (
                        <div className="space-y-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-32 mx-auto object-contain"
                          />
                          <p className="text-sm text-gray-500">
                            {isImageChanged
                              ? 'Click to change image'
                              : 'Click to upload new image'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
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
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Category Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter category name"
                    required
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled>Updating...</Button>
            ) : (
              <Button type="submit">Update Category</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategory;
