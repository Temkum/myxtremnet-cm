'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  History,
  Search,
  Calendar,
  Package,
  Download,
  Filter,
} from 'lucide-react';

const serviceNumbers = ['620779967', '620779968', '620779969'];

const months = [
  { value: '202509', label: 'September 2025' },
  { value: '202508', label: 'August 2025' },
  { value: '202507', label: 'July 2025' },
  { value: '202506', label: 'June 2025' },
  { value: '202505', label: 'May 2025' },
  { value: '202504', label: 'April 2025' },
];

const orderHistory = [
  {
    id: 'ORD-001',
    date: '01/09/2025 20:47:27',
    package: 'LTE Standard',
    data: '15 GB',
    amount: 5000,
    status: 'completed',
    validity: '01/09/2025 - 01/10/2025',
  },
  {
    id: 'ORD-002',
    date: '08/08/2025 19:18:57',
    package: 'LTE Basic',
    data: '5 GB',
    amount: 2500,
    status: 'completed',
    validity: '08/08/2025 - 15/08/2025',
  },
  {
    id: 'ORD-003',
    date: '11/08/2025 10:26:58',
    package: 'LTE Standard',
    data: '15 GB',
    amount: 5000,
    status: 'completed',
    validity: '11/08/2025 - 10/09/2025',
  },
  {
    id: 'ORD-004',
    date: '14/08/2025 10:42:35',
    package: 'LTE Premium',
    data: '50 GB',
    amount: 15000,
    status: 'completed',
    validity: '14/08/2025 - 13/09/2025',
  },
  {
    id: 'ORD-005',
    date: '20/07/2025 15:30:00',
    package: 'WTTx Indoor Home',
    data: '30 GB',
    amount: 10000,
    status: 'completed',
    validity: '20/07/2025 - 19/08/2025',
  },
];

export default function OrderHistoryPage() {
  const [selectedService, setSelectedService] = useState('620779967');
  const [selectedMonth, setSelectedMonth] = useState('202509');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground">
            View and track your past orders
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Inquiry Form */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Order History Inquire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm opacity-80">Service No</label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceNumbers.map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm opacity-80">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="px-8">
              <Search className="h-4 w-4 mr-2" />
              Enquiry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{orderHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <History className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">
                  {orderHistory.filter((o) => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">37,500 FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Table */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderHistory.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary/30">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.package}</TableCell>
                    <TableCell>{order.data}</TableCell>
                    <TableCell className="font-medium">
                      {order.amount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.validity}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          First
        </Button>
        <Button variant="outline" size="sm" disabled>
          Prev
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
        <Button variant="outline" size="sm">
          Last
        </Button>
      </div>
    </div>
  );
}
