'use client';

import {
  changePasswordAction,
  updateUserProfileAction,
} from '@/actions/setting';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { env } from '@/env';
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormData,
  type UpdateProfileFormData,
} from '@/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  KeyRound,
  Loader2,
  Save,
  UserCog,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { toast } from 'sonner';

interface SettingsFormProps {
  userId: string;
  defaultName: string;
  defaultImage: string;
}

/* ─────────────────────────────────────────
   Profile Info Form
───────────────────────────────────────── */
const ProfileInfoForm = ({
  userId,
  defaultName,
  defaultImage,
}: SettingsFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>(defaultImage);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    const toastId = toast.loading('Updating profile...');
    try {
      let imageUrl: string | undefined;

      // Upload image first if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('coverImg', imageFile);

        const uploadRes = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_API_URL}upload-image`,
          { method: 'POST', body: formData }
        );
        const uploadData = await uploadRes.json();

        if (!uploadData?.data) {
          return toast.error('Image upload failed', { id: toastId });
        }
        imageUrl = uploadData.data as string;
      }

      const result = await updateUserProfileAction(userId, {
        name: data.name,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      if (!result?.success) {
        return toast.error(result?.message ?? 'Update failed', { id: toastId });
      }

      toast.success('Profile updated successfully', { id: toastId });
      setImageFile(null);
      router.push('/profile');
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="border-border/50 shadow-sm dark:bg-card/40">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCog className="w-5 h-5 text-primary" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your display name and profile picture.
        </CardDescription>
      </CardHeader>

      <Separator className="bg-border/40" />

      <CardContent className="pt-5">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>

          {/* Avatar image upload */}
          <Field>
            <FieldLabel>Profile Picture</FieldLabel>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div
                className="relative w-20 h-20 rounded-full border-2 border-dashed border-border/60 overflow-hidden bg-muted flex items-center justify-center cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
                )}
              </div>

              <div className="space-y-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP. Recommended 400×400px.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </Field>

          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Display Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="gap-2 w-full sm:w-auto text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PasswordField = ({
  name,
  id,
  label,
  show,
  onToggle,
  control,
}: {
  name: 'currentPassword' | 'newPassword' | 'confirmPassword';
  id: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  control: Control<ChangePasswordFormData>;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={id}
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            {...field}
            aria-invalid={fieldState.invalid}
          />
          <InputGroupAddon align="inline-end">
            {show ? (
              <EyeIcon
                onClick={onToggle}
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              />
            ) : (
              <EyeOffIcon
                onClick={onToggle}
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              />
            )}
          </InputGroupAddon>
        </InputGroup>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

/* ─────────────────────────────────────────
   Change Password Form
───────────────────────────────────────── */
const ChangePasswordForm = () => {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const toastId = toast.loading('Changing password...');
    try {
      const result = await changePasswordAction({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (!result?.success) {
        return toast.error(result?.message ?? 'Failed to change password', {
          id: toastId,
        });
      }

      toast.success('Password changed successfully', { id: toastId });
      form.reset();
      router.push('/')
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="border-border/50 shadow-sm dark:bg-card/40">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password. Must be at least 8 characters with one uppercase
          letter, one lowercase letter and a number.
        </CardDescription>
      </CardHeader>

      <Separator className="bg-border/40" />

      <CardContent className="pt-5">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <PasswordField
            name="currentPassword"
            id="currentPassword"
            label="Current Password"
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
            control={form.control}
          />
          <PasswordField
            name="newPassword"
            id="newPassword"
            label="New Password"
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            control={form.control}
          />
          <PasswordField
            name="confirmPassword"
            id="confirmPassword"
            label="Confirm New Password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            control={form.control}
          />

          <Button
            type="submit"
            className="gap-2 w-full sm:w-auto text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

/* ─────────────────────────────────────────
   Composed export
───────────────────────────────────────── */
const SettingsForm = ({
  userId,
  defaultName,
  defaultImage,
}: SettingsFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ProfileInfoForm
        userId={userId}
        defaultName={defaultName}
        defaultImage={defaultImage}
      />
      <ChangePasswordForm />
    </div>
  );
};

export default SettingsForm;
