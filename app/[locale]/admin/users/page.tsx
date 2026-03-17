'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Eye,
  Edit,
  Ban,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { allUsers } from '@/data/admin';
import { useState } from 'react';

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access user management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all user accounts
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers
                  .filter(
                    (user) =>
                      user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.phoneNumber.includes(searchTerm),
                  )
                  .map((user) => (
                    <TableRow key={user.id} className="hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {user.serviceId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.balance.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{user.joinDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant={
                                user.status === 'active'
                                  ? 'destructive'
                                  : 'default'
                              }
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
