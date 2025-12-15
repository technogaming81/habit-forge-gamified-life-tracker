import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserHeader } from '@/components/dashboard/UserHeader';
import { HabitGrid } from '@/components/dashboard/HabitGrid';
import { GamificationSidebar } from '@/components/dashboard/GamificationSidebar';
import { Button } from '@/components/ui/button';
import { Archive, PlusCircle } from 'lucide-react';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
import { useHabits, useIsFirstLogin } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingTour } from '@/components/OnboardingTour';
const HabitModal = React.lazy(() => import('@/components/modals/HabitModal').then(module => ({ default: module.HabitModal })));
const EmptyState = ({ openModal }: { openModal: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center col-span-full py-16 bg-muted/50 rounded-2xl"
  >
    <h3 className="text-2xl font-semibold">Forge Your First Habit</h3>
    <p className="text-muted-foreground mt-2 mb-6">It all starts with a single step. What will you improve today?</p>
    <Button onClick={openModal} size="lg" className="rounded-full">
      <PlusCircle className="mr-2 h-5 w-5" />
      Create New Habit
    </Button>
  </motion.div>
);
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-[220px] w-full rounded-2xl" />
      </div>
    ))}
  </div>
);
export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const habits = useHabits();
  const isFirstLogin = useIsFirstLogin();
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const activeHabits = habits.filter(h => !h.archived);
  const archivedHabits = habits.filter(h => h.archived);
  const habitsToShow = showArchived ? archivedHabits : activeHabits;
  return (
    <DashboardLayout>
      {isFirstLogin && <OnboardingTour />}
      <div className="flex flex-col gap-6">
        <UserHeader />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {showArchived ? 'Archived Habits' : "Today's Habits"}
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowArchived(!showArchived)}>
                <Archive className="mr-2 h-4 w-4" />
                {showArchived ? 'Show Active' : `Archived (${archivedHabits.length})`}
              </Button>
            </div>
            {isLoading ? (
              <LoadingState />
            ) : habitsToShow.length > 0 ? (
              <HabitGrid habits={habitsToShow} openModal={() => setIsModalOpen(true)} showArchived={showArchived} />
            ) : (
              !showArchived && <EmptyState openModal={() => setIsModalOpen(true)} />
            )}
          </div>
          <div className="lg:col-span-1">
             <h2 className="text-2xl font-bold tracking-tight mb-4">Activity Feed</h2>
            <GamificationSidebar />
            <InsightsCards />
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <AnimatePresence>
          {isModalOpen && <HabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        </AnimatePresence>
      </Suspense>
    </DashboardLayout>
  );
}