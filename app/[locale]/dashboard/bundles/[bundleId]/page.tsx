import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function BundleDetails() {
  const details = [
    '10 GB Internet Data',
    '1000 Minutes National Calls',
    '1000 SMS to all networks',
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <Button variant="ghost" className="mb-6 -ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <Link href="/dashboard/bundles">Back to offers</Link>
      </Button>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Bundle Information
          </h2>
          <h1 className="text-4xl font-extrabold mt-1">Toli Single L</h1>
        </div>

        <div className="bg-muted/50 p-6 rounded-xl border">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-muted-foreground font-medium">Price</span>
            <span className="text-3xl font-bold text-primary">10,000 FCFA</span>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Bundle Includes:</h3>
            <ul className="space-y-3">
              {details.map((item, i) => (
                <li key={i} className="flex items-center text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button className="flex-1 h-12 text-lg">Confirm Subscription</Button>
          <Link href="/dashboard/bundles">
            <Button
              variant="outline"
              className="flex-1 h-12 text-lg text-destructive"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
