'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  X,
  Plus,
  Upload,
  User,
  Phone,
  Mail,
  Shield,
  FileText,
  Camera,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  adminCreateUserSchema,
  AdminCreateUserInput,
} from '@/lib/validations/auth';

export default function CreateUserForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<AdminCreateUserInput>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      phoneNumbers: ['620'],
      idCardNumber: '',
      locationPlan: '',
      photo: undefined,
    },
    mode: 'onChange',
  });

  // FIX #4: Use useFieldArray for proper phone number management
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers' as FieldArrayPath<AdminCreateUserInput>,
  });

  const selectedRole = watch('role');
  const watchedPhoneNumbers = watch('phoneNumbers');

  // Check for duplicate phone numbers
  const phoneNumberErrors = useMemo(() => {
    const errors: { [key: number]: string } = {};
    const phoneMap = new Map<string, number[]>();

    watchedPhoneNumbers.forEach((phone, index) => {
      if (phone && phone.trim()) {
        const trimmedPhone = phone.trim();
        if (!phoneMap.has(trimmedPhone)) {
          phoneMap.set(trimmedPhone, []);
        }
        phoneMap.get(trimmedPhone)!.push(index);
      }
    });

    // Mark duplicates
    phoneMap.forEach((indices, phone) => {
      if (indices.length > 1) {
        indices.forEach((index) => {
          errors[index] = 'Duplicate phone number';
        });
      }
    });

    return errors;
  }, [watchedPhoneNumbers]);

  // Handle phone number input with Camtel format (620xxxxxx)
  const handlePhoneChange = useCallback(
    (index: number, value: string) => {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');

      // Always start with 620
      let formattedValue = '620';

      // Add remaining digits up to 9 total
      if (digits.length > 3) {
        const remainingDigits = digits.slice(3, 9);
        formattedValue += remainingDigits;
      }

      // Update the form value
      setValue(`phoneNumbers.${index}`, formattedValue, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setPhoto(file);
      // FIX #5: Register photo with RHF for proper validation
      setValue('photo', file ?? undefined, { shouldValidate: true });

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError('photo', { message: 'File exceeds 5MB' });
          return;
        }
        if (!file.type.startsWith('image/')) {
          setError('photo', { message: 'Invalid image type' });
          return;
        }
        clearErrors('photo');
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    },
    [setValue, setError, clearErrors],
  );

  // FIX #4: Remove manual phone array management - now handled by useFieldArray

  const onSubmit = async (data: AdminCreateUserInput) => {
    setIsSubmitting(true);
    try {
      // FIX #6: Remove PII from console logs
      console.log('Creating user with data:', {
        name: data.name,
        email: data.email,
        role: data.role,
        phoneCount: data.phoneNumbers.length,
        hasPhoto: !!photo,
      });

      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'phoneNumbers') {
          // Filter out empty phone numbers before sending
          const validPhones = (value as string[]).filter(
            (phone) => phone.trim().length > 0,
          );
          body.append(key, JSON.stringify(validPhones));
        } else if (key !== 'photo') {
          body.append(key, value as string);
        }
      });
      if (photo) body.append('photo', photo);

      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const result = await res.json();
      console.log('✅ User created successfully:', { userId: result.userId });

      // FIX #1: Don't expose password in UI - notify admin through secure channel
      toast.success(
        `User "${data.name}" created successfully! Temporary password sent via secure channel.`,
      );
      onSuccess();
    } catch (err) {
      console.error('❌ Error creating user:', err);
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-1xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-primary" />
          User Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Profile Identity */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
            <div className="flex items-center">
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Basic Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Full Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register('name')}
                  placeholder="John Doe"
                  className={
                    errors.name
                      ? 'border-destructive focus:border-destructive'
                      : ''
                  }
                />
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-2.5 h-4 w-4 ${errors.email ? 'text-destructive' : 'text-muted-foreground'}`}
                  />
                  <Input
                    {...register('email')}
                    className={`pl-10 ${errors.email ? 'border-destructive focus:border-destructive' : ''}`}
                    placeholder="john@camtel.cm"
                    type="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                System Role
                <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val: 'user' | 'admin') =>
                  setValue('role', val, { shouldValidate: true })
                }
                defaultValue="user"
              >
                <SelectTrigger
                  className={`w-full ${errors.role ? 'border-destructive' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`h-4 w-4 ${errors.role ? 'text-destructive' : 'text-muted-foreground'}`}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Standard User</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Phone
                <span className="text-destructive ml-1">*</span>
              </h3>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register(`phoneNumbers.${index}`)}
                      type="tel"
                      placeholder="620 xxx xxx"
                      maxLength={9}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className={`pl-10 tabular-nums ${
                        errors.phoneNumbers?.[index] || phoneNumberErrors[index]
                          ? 'border-destructive focus:border-destructive'
                          : ''
                      }`}
                    />
                    {(errors.phoneNumbers?.[index] ||
                      phoneNumberErrors[index]) && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0"></span>
                        {phoneNumberErrors[index] ||
                          errors?.phoneNumbers?.[index]?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append('620')}
                className="w-full"
                disabled={fields.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number {fields.length >= 5 && '(Max 5)'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Section: Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Compliance
              </h3>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  ID Card / Passport
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register('idCardNumber')}
                  placeholder="ID# 123456789"
                  className={
                    errors.idCardNumber
                      ? 'border-destructive focus:border-destructive'
                      : ''
                  }
                />
                {errors.idCardNumber && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.idCardNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Location Description
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  {...register('locationPlan')}
                  className={`resize-none ${errors.locationPlan ? 'border-destructive focus:border-destructive' : ''}`}
                  rows={3}
                  placeholder="Describe the installation location..."
                />
                {errors.locationPlan && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.locationPlan.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4" /> Photo ID
              </h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 min-h-[160px] bg-muted/10 transition-colors hover:bg-muted/20">
                {photoPreview ? (
                  <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover shadow-md"
                    />
                    <button
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                        setValue('photo', undefined, { shouldValidate: true });
                        clearErrors('photo');
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <span className="text-xs font-medium block">
                      Upload Passport Size
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      JPG, PNG up to 5MB
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
                {errors.photo && (
                  <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.photo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onSuccess}
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !isValid ||
                Object.keys(phoneNumberErrors).length > 0
              }
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
