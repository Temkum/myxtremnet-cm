import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ServiceListing() {
  const t = useTranslations('UserBundles');
  const phoneNumber = '620779967';

  const offers = [
    {
      id: 'toli-single-xl',
      name: 'Toli Single XL',
      category: 'Toli',
      price: '15,000 FCFA',
    },
    {
      id: 'toli-single-l',
      name: 'Toli Single L',
      category: 'Toli',
      price: '10,000 FCFA',
    },
    {
      id: 'toli-single-s',
      name: 'Toli Single S',
      category: 'Toli',
      price: '5,000 FCFA',
    },
    {
      id: 'toli-single-xs',
      name: 'Toli Single XS',
      category: 'Toli',
      price: '2,500 FCFA',
    },
    {
      id: 'toli-single-m',
      name: 'Toli Single M',
      category: 'Toli',
      price: '7,500 FCFA',
    },
    {
      id: 'toli-single-xxl',
      name: 'Toli Single XXL',
      category: 'Toli',
      price: '20,000 FCFA',
    },
    {
      id: 'blue-mo-m',
      name: 'Blue mo M',
      category: 'Blue',
      price: '5,000 FCFA',
    },
    {
      id: 'blue-mo-xxl',
      name: 'Blue mo XXL',
      category: 'Blue',
      price: '20,000 FCFA',
    },
    {
      id: 'blue-mo-xl',
      name: 'Blue mo XL',
      category: 'Blue',
      price: '15,000 FCFA',
    },
    {
      id: 'blue-mo-s',
      name: 'Blue mo S',
      category: 'Blue',
      price: '2,500 FCFA',
    },
    {
      id: 'blue-mo-l',
      name: 'Blue mo L',
      category: 'Blue',
      price: '10,000 FCFA',
    },
    {
      id: 'blue-one-s',
      name: 'Blue One S',
      category: 'Blue',
      price: '2,500 FCFA',
    },
    {
      id: 'blue-one-m',
      name: 'Blue One M',
      category: 'Blue',
      price: '5,000 FCFA',
    },
    {
      id: 'blue-one-xl',
      name: 'Blue One XL',
      category: 'Blue',
      price: '15,000 FCFA',
    },
    {
      id: 'blue-one-xxl',
      name: 'Blue One XXL',
      category: 'Blue',
      price: '20,000 FCFA',
    },
    {
      id: 'blue-go-l',
      name: 'Blue Go L',
      category: 'Blue',
      price: '10,000 FCFA',
    },
    {
      id: 'blue-go-m',
      name: 'Blue Go M',
      category: 'Blue',
      price: '5,000 FCFA',
    },
    {
      id: 'blue-go-xl',
      name: 'Blue Go XL',
      category: 'Blue',
      price: '15,000 FCFA',
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('subscribeOffer')}
          </h1>
          <p className="text-muted-foreground">
            {t('selectService', { phoneNumber })}
          </p>
        </div>
        <Button variant="outline">{t('changeNumber')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="hover:border-primary transition-colors cursor-pointer group"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{offer.category}</Badge>
                <span className="text-lg font-bold text-primary">
                  {offer.price}
                </span>
              </div>
              <CardTitle className="pt-2">{offer.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Link href={`/dashboard/bundles/${offer.id}`}>
                <Button className="w-full group-hover:bg-primary">
                  {t('subscribe')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
