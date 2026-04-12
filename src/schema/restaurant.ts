import z from 'zod';

export const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),

  coverImg: z
    .instanceof(File)
    .optional()
    .refine((file) => file instanceof File, {
      message: 'Cover image is required',
    }),
  avatarImg: z
    .instanceof(File)
    .optional()
    .refine((file) => file instanceof File, {
      message: 'Cover image is required',
    }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Opening time must be in HH:MM format (e.g., 09:00)',
  }),
  closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Closing time must be in HH:MM format (e.g., 22:00)',
  }),
  offday: z.string().min(1, 'Off day is required'),
});
