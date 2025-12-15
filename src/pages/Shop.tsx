import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ShopModal } from '@/components/shop/ShopModal';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Coins, Shield } from 'lucide-react';
import { useUserStats } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function Shop() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { coins, streakFreezes } = useUserStats();
  return (
    <DashboardLayout>
      <div className="py-8 md:py-10 lg:py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full mb-6">
            <ShoppingCart className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Item Shop</h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Use your coins to purchase items that help you on your journey or customize your experience.
          </p>
          <Button size="lg" className="rounded-full text-lg px-8 py-6" onClick={() => setIsShopOpen(true)}>
            <Coins className="mr-2 h-5 w-5" />
            Open Shop ({coins} Coins)
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6">Your Inventory</h2>
          <div className="max-w-md mx-auto">
            <Card className="rounded-2xl text-left">
              <CardHeader>
                <CardTitle>Active Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <span className="font-medium">Streak Freezes</span>
                  </div>
                  <span className="font-bold text-lg">{streakFreezes}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {isShopOpen && <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}