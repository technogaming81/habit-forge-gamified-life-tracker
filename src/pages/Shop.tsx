import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ShopModal } from '@/components/shop/ShopModal';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Coins } from 'lucide-react';
export function Shop() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Open Shop
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isShopOpen && <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}