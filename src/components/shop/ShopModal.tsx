import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useShopItems, useUserStats, useHabitActions } from "@/lib/store";
import { Coins } from "lucide-react";
import { toast } from "sonner";
interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function ShopModal({ isOpen, onClose }: ShopModalProps) {
  const shopItems = useShopItems();
  const { coins } = useUserStats();
  const { purchaseItem } = useHabitActions();
  const handlePurchase = (itemId: string) => {
    const success = purchaseItem(itemId);
    if (success) {
      toast.success("Purchase successful! 🎉");
    } else {
      toast.error("Not enough coins! 😥");
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Item Shop</SheetTitle>
          <SheetDescription>
            Spend your hard-earned coins on useful items and cosmetics.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <div className="flex items-center justify-end gap-2 mb-6 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <Coins className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold">{coins}</span>
          </div>
          <div className="space-y-4">
            {shopItems.map((item) => (
              <Card key={item.id} className="rounded-xl">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handlePurchase(item.id)}
                    disabled={coins < item.cost}
                    className="w-full"
                  >
                    Buy for {item.cost} Coins
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}