'use client';

import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { toast } from 'sonner';

interface PhoneNumber {
  id: string;
  number: string;
}

interface CreateUserFormData {
  name: string;
  email: string;
  role: 'user' | 'admin';
  phoneNumbers: PhoneNumber[];
  idCardNumber: string;
  locationPlan: string;
  photo: File | null;
}

export default function CreateUserForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<CreateUserFormData>({
    name: '',
    email: '',
    role: 'user',
    phoneNumbers: [{ id: '1', number: '' }],
    idCardNumber: '',
    locationPlan: '',
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof CreateUserFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPhoneNumber = () => {
    const newId = Date.now().toString();
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, { id: newId, number: '' }],
    }));
  };

  const removePhoneNumber = (id: string) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((phone) => phone.id !== id),
      }));
    }
  };

  const updatePhoneNumber = (id: string, number: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone) =>
        phone.id === id ? { ...phone, number } : phone,
      ),
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      formDataToSend.append(
        'phoneNumbers',
        JSON.stringify(formData.phoneNumbers.filter((p) => p.number.trim())),
      );
      formDataToSend.append('idCardNumber', formData.idCardNumber);
      formDataToSend.append('locationPlan', formData.locationPlan);

      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      toast.success('User created successfully');
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create user',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phoneNumbers.some((p) => p.number.trim()) &&
      formData.idCardNumber.trim() &&
      formData.locationPlan.trim()
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Create New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="user@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'user' | 'admin') =>
                  handleInputChange('role', value)
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <SelectValue placeholder="Select role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Phone Numbers *</h3>
            <div className="space-y-2">
              {formData.phoneNumbers.map((phone, index) => (
                <div key={phone.id} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={phone.number}
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={9}
                      onChange={(e) =>
                        updatePhoneNumber(phone.id, e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="pl-10"
                      required={index === 0}
                    />
                  </div>
                  {formData.phoneNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhoneNumber(phone.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPhoneNumber}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
              </Button>
            </div>
          </div>

          {/* Government Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Government Information</h3>

            <div className="space-y-2">
              <Label htmlFor="idCardNumber">ID Card Number *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={(e) =>
                    handleInputChange('idCardNumber', e.target.value)
                  }
                  placeholder="Enter government-issued ID number"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationPlan">Location Plan *</Label>
              <Textarea
                id="locationPlan"
                value={formData.locationPlan}
                onChange={(e) =>
                  handleInputChange('locationPlan', e.target.value)
                }
                placeholder="Enter location plan details"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Passport Photo</h3>

            <div className="space-y-2">
              {photoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Passport photo preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={removePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload passport photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById('photo-upload')?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
