'use client';

import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Key, LogOut, Wifi } from 'lucide-react';

export function UserWelcome() {
  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Wifi className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm opacity-80">Welcome,</p>
            <h2 className="text-lg font-bold">KUM JUDE THADDEUS TEM</h2>
            <p className="text-sm opacity-80 mt-1">620779967</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full justify-start bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
            asChild
          >
            <Link href="/dashboard/account">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
