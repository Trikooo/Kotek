import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAddressRequest } from "@/hooks/address/useAddress";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
// This will not delete addresses that are related to orders, instead it will archive them.
export default function DeleteAddressDialog({
  addressId,
  onDeleteAddress,
}: {
  addressId: string;
  onDeleteAddress: (addressId: string) => void;
}) {
  const { handleDeleteAddress } = useAddressRequest();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const handleDeleteAddressClick = async () => {
    try {
      if (userId) {
        const address = await handleDeleteAddress(addressId, userId);
        console.log(address);
        toast({
          title: "Successfully deleted address",
        });
      }
      onDeleteAddress(addressId);
    } catch (error) {
      toast({
        title: "Failed to delete address",
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete address</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete address?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this address. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAddressClick}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
