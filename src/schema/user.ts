import z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        'Must contain one capital letter, one small letter and a number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
