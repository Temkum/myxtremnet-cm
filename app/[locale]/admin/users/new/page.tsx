'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import CreateUserForm from '@/components/admin/create-user-form';

export default function NewUserPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to create users.
          </p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    toast.success('User created successfully!');
    router.push('/admin/users');
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Create New User
          </h1>
          <p className="text-muted-foreground">
            Add a new user to the system with full account details
          </p>
        </div>
      </div>

      {/* Form Container */}
      <Card className="border shadow-lg">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <CreateUserForm onSuccess={handleSuccess} />

          {/* Page-level Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Quick Tips:</p>
              <ul className="mt-2 space-y-1">
                <li>• All required fields are marked with an asterisk (*)</li>
                <li>• Phone numbers must start with 620 and be 9 digits</li>
                <li>• Photo uploads are limited to 5MB in JPG/PNG format</li>
                <li>• Banned/Blacklisted users require a reason</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              User Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <strong>Standard User:</strong> Can access services, manage own
                account
              </div>
              <div>
                <strong>Administrator:</strong> Full system access, user
                management
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <strong>Active:</strong> Full access to services
              </div>
              <div>
                <strong>Banned:</strong> Temporary suspension (reversible)
              </div>
              <div>
                <strong>Blacklisted:</strong> Permanent block (rare cases)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance Fields
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <strong>Wallet Balance:</strong> Monetary credit in FCFA
              </div>
              <div>
                <strong>Data Balance:</strong> Data allowance (MB/GB)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
