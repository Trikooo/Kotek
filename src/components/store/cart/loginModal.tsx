
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            Login to save your addresses, cart, and manage your orders.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-start">
          <Link href="/checkout/shipping">
            <Button type="button" variant="secondary" className="mr-2">
              Continue as Guest
            </Button>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
