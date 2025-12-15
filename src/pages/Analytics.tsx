import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Heatmap } from '@/components/analytics/Heatmap';
import { HabitStats } from '@/components/analytics/HabitStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
import { motion, AnimatePresence } from 'framer-motion';
const tabContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
export function Analytics() {
  return (
    <DashboardLayout>
      <div className="py-8 md:py-10 lg:py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Analytics Hub</h1>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Habit Stats</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <TabsContent value="overview" asChild>
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Heatmap />
              </motion.div>
            </TabsContent>
            <TabsContent value="stats" asChild>
              <motion.div
                key="stats"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <HabitStats />
              </motion.div>
            </TabsContent>
            <TabsContent value="insights" asChild>
              <motion.div
                key="insights"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <InsightsCards />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}