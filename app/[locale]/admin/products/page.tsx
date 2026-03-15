'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Wifi,
  DollarSign,
  Users,
  Activity,
  Star,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

// Mock products data
const products = [
  {
    id: '1',
    name: 'X-tremNet 4G Dongle',
    description: 'High-speed 4G LTE dongle for portable internet access',
    category: 'Hardware',
    price: 35000,
    stock: 150,
    sold: 1250,
    rating: 4.5,
    active: true,
    image: '/products/dongle.jpg',
    features: ['4G LTE', 'Plug & Play', 'WiFi Hotspot', 'Up to 100 Mbps'],
  },
  {
    id: '2',
    name: 'WTTx Indoor Router',
    description: 'Wireless broadband router for home and office use',
    category: 'Hardware',
    price: 75000,
    stock: 80,
    sold: 450,
    rating: 4.7,
    active: true,
    image: '/products/router.jpg',
    features: ['Dual Band WiFi', '4 LAN Ports', 'Up to 200 Mbps', 'Easy Setup'],
  },
  {
    id: '3',
    name: 'Outdoor Antenna Kit',
    description: 'Professional outdoor antenna for improved signal strength',
    category: 'Accessories',
    price: 25000,
    stock: 200,
    sold: 180,
    rating: 4.3,
    active: true,
    image: '/products/antenna.jpg',
    features: ['Weather Proof', 'High Gain', 'Universal Mount', 'Signal Boost'],
  },
  {
    id: '4',
    name: 'WiFi Extender',
    description: 'Extend your WiFi coverage throughout your home',
    category: 'Accessories',
    price: 15000,
    stock: 300,
    sold: 320,
    rating: 4.1,
    active: false,
    image: '/products/extender.jpg',
    features: [
      'Universal Compatibility',
      'Easy Setup',
      'AC1200 Speed',
      'WPS Button',
    ],
  },
];

export default function ProductsPage() {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access product management.
          </p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalSold = products.reduce((sum, product) => sum + product.sold, 0);
  const totalRevenue = products.reduce(
    (sum, product) => sum + product.price * product.sold,
    0,
  );
  const activeProducts = products.filter((product) => product.active).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage hardware products and accessories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="font-bold text-xl">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="font-bold text-xl">{activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="font-bold text-xl">{totalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="font-bold text-xl">
                  {(totalRevenue / 1000000).toFixed(1)}M FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                <option value="Hardware">Hardware</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        className={
                          product.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span
                        className={`font-medium ${product.stock < 50 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {product.stock}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sold:</span>
                      <span className="font-medium">{product.sold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">
                        {((product.price * product.sold) / 1000000).toFixed(1)}M
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
