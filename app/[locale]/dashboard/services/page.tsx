'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Radio,
  Satellite,
  Router,
  Wifi,
  ChevronRight,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';

const serviceCategories = [
  {
    id: 'lte',
    name: 'LTE SERVICE',
    icon: Radio,
    description: 'High-speed mobile data with nationwide coverage',
    offers: [
      {
        name: 'LTE Basic',
        data: '5 GB',
        price: 2500,
        validity: '7 days',
        popular: false,
      },
      {
        name: 'LTE Standard',
        data: '15 GB',
        price: 5000,
        validity: '30 days',
        popular: true,
      },
      {
        name: 'LTE Premium',
        data: '50 GB',
        price: 15000,
        validity: '30 days',
        popular: false,
      },
      {
        name: 'LTE Unlimited',
        data: 'Unlimited',
        price: 25000,
        validity: '30 days',
        popular: false,
      },
    ],
  },
  {
    id: 'wttx-outdoor',
    name: 'WTTx Outdoor',
    icon: Satellite,
    description: 'Wireless-to-the-X outdoor connectivity solutions',
    offers: [
      {
        name: 'Outdoor Basic',
        data: '20 GB',
        price: 8000,
        validity: '30 days',
        popular: false,
      },
      {
        name: 'Outdoor Standard',
        data: '50 GB',
        price: 15000,
        validity: '30 days',
        popular: true,
      },
      {
        name: 'Outdoor Premium',
        data: '100 GB',
        price: 25000,
        validity: '30 days',
        popular: false,
      },
    ],
  },
  {
    id: 'wttx-indoor',
    name: 'WTTx Indoor',
    icon: Router,
    description: 'Indoor wireless broadband for home and office',
    offers: [
      {
        name: 'Indoor Home',
        data: '30 GB',
        price: 10000,
        validity: '30 days',
        popular: false,
      },
      {
        name: 'Indoor Business',
        data: '75 GB',
        price: 20000,
        validity: '30 days',
        popular: true,
      },
      {
        name: 'Indoor Enterprise',
        data: '150 GB',
        price: 35000,
        validity: '30 days',
        popular: false,
      },
    ],
  },
  {
    id: 'ul',
    name: 'UL Service',
    icon: Wifi,
    description: 'Ultra-low latency service for demanding applications',
    offers: [
      {
        name: 'UL Basic',
        data: '10 GB',
        price: 5000,
        validity: '30 days',
        popular: false,
      },
      {
        name: 'UL Pro',
        data: '40 GB',
        price: 12000,
        validity: '30 days',
        popular: true,
      },
    ],
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState('lte');
  const [showAlert, setShowAlert] = useState(true);

  const currentService = serviceCategories.find(
    (s) => s.id === selectedService
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Services & Offers
          </h1>
          <p className="text-muted-foreground">
            Browse and subscribe to our internet packages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary">
            <Package className="h-3 w-3 mr-1" />
            Active Plan: LTE Standard
          </Badge>
        </div>
      </div>

      {/* System Alert */}
      {showAlert && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Notice</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>System abnormalities, please try later!</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlert(false)}
            >
              OK
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Service Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {serviceCategories.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService === service.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-secondary/50'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  selectedService === service.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm">{service.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Service Offers */}
      {currentService && (
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <currentService.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{currentService.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentService.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="offers" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="offers">Available Offers</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
              </TabsList>
              <TabsContent value="offers">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentService.offers.map((offer, index) => (
                    <Card
                      key={index}
                      className={`relative overflow-hidden ${
                        offer.popular ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      {offer.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg">
                          Popular
                        </div>
                      )}
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-lg mb-2">
                          {offer.name}
                        </h4>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Data</span>
                            <span className="font-medium">{offer.data}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Validity
                            </span>
                            <span className="font-medium">
                              {offer.validity}
                            </span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {offer.price.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground"> FCFA</span>
                        </div>
                        <Button
                          className="w-full"
                          variant={offer.popular ? 'default' : 'outline'}
                        >
                          Subscribe
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="packages">
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Package bundles coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Instant Activation</h4>
              <p className="text-sm text-muted-foreground">
                Get connected immediately
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Nationwide Coverage</h4>
              <p className="text-sm text-muted-foreground">
                Connect anywhere in Cameroon
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">Flexible Plans</h4>
              <p className="text-sm text-muted-foreground">
                Choose what suits you best
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
