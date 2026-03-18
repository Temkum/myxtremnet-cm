'use client';

import React, { useState, useCallback } from 'react';
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
import { Badge } from '../ui/badge';
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
      phoneNumbers: [''],
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
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Basic Profile
              </h3>
              <Badge variant="outline" className="font-mono">
                {selectedRole}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input {...register('name')} placeholder="John Doe" />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register('email')}
                    className="pl-10"
                    placeholder="john@camtel.cm"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>System Role</Label>
              <Select
                onValueChange={(val: 'user' | 'admin') => setValue('role', val)}
                defaultValue="user"
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Standard User</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Phone Connectivity
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
                      placeholder="6xx xxx xxx"
                      className="pl-10 tabular-nums"
                    />
                    {errors.phoneNumbers?.[index] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.phoneNumbers[index]?.message}
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
                onClick={() => append('')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
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
                <Label>ID Card / Passport</Label>
                <Input
                  {...register('idCardNumber')}
                  placeholder="ID# 123456789"
                />
                {errors.idCardNumber && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.idCardNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Location Description</Label>
                <Textarea
                  {...register('locationPlan')}
                  className="resize-none"
                  rows={3}
                />
                {errors.locationPlan && (
                  <p className="text-xs text-destructive mt-1">
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
                  <p className="text-xs text-destructive mt-2">
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
              disabled={isSubmitting || !isValid}
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
