import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="bg-primary/10 p-4 rounded-full">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {title.replace('-', ' ')}
        </h1>
        <p className="text-muted-foreground max-w-xs">
          This feature is currently under development.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
