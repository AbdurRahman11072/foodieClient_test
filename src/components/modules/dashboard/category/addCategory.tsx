'use client';
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
import { PlusIcon, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const categoryScheam = z.object({
  name: z.string().min(1, 'Name is required'),
  coverImg: z.instanceof(File).refine((file) => file instanceof File, {
    message: `Cover image is required`,
  }),
});

const AddCategory = () => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoding] = useState(false);

  const form = useForm<z.infer<typeof categoryScheam>>({
    resolver: zodResolver(categoryScheam),
    defaultValues: {
      name: '',
      coverImg: undefined,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('coverImg', file);
    }
  };

  const onSubmit = async (formData: z.infer<typeof categoryScheam>) => {
    setIsLoding(true);

    try {
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
      console.log(imgData?.data);

      const data = {
        name: formData.name,
        coverImg: imgData?.data,
      };

      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      // updateTag('AllCategory');

      console.log(res);

      if (!res.ok) {
        throw new Error('Failed to create category');
      }

      // Close dialog and reset form on success
      setOpen(false);
      form.reset();
      setPreviewUrl('');
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Error creating category:');
    } finally {
      setIsLoding(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
    setPreviewUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex justify-center items-center text-white font-semibold">
          <PlusIcon />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription className="hidden">
              Add the food category
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
                            Click to change image
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
              <Button disabled>Uploading...</Button>
            ) : (
              <Button type="submit">Add Category</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
