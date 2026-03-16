'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LoginComponent } from '../login/LoginComponent';

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] p-6 gap-0 flex flex-col items-center justify-center overflow-hidden">
        <DialogHeader className="w-full space-y-2 pb-6">
          <DialogTitle className="text-center text-2xl font-bold tracking-tight">
            Sign In
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-center">
          <LoginComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
