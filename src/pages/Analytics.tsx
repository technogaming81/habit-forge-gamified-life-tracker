import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Heatmap } from '@/components/analytics/Heatmap';
import { HabitStats } from '@/components/analytics/HabitStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
type AnalyticsTab = 'overview' | 'stats' | 'insights';
const tabContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: ["easeOut"] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: ["easeIn"] } },
};
export function Analytics() {
  const [tab, setTab] = useState<AnalyticsTab>('overview');
  return (
    <DashboardLayout>
      <div className="py-8 md:py-10 lg:py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Analytics Hub</h1>
        <Tabs value={tab} onValueChange={(value) => setTab(value as AnalyticsTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sticky top-[57px] lg:top-[61px] z-10 bg-background/95 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Habit Stats</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {tab === 'overview' && <Heatmap />}
              {tab === 'stats' && <HabitStats />}
              {tab === 'insights' && <InsightsCards />}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}