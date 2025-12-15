import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserHeader } from '@/components/dashboard/UserHeader';
import { HabitGrid } from '@/components/dashboard/HabitGrid';
import { GamificationSidebar } from '@/components/dashboard/GamificationSidebar';
import { HabitModal } from '@/components/modals/HabitModal';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  return (
    <DashboardLayout>
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
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </div>
            <HabitGrid openModal={() => setIsModalOpen(true)} showArchived={showArchived} />
          </div>
          <div className="lg:col-span-1">
             <h2 className="text-2xl font-bold tracking-tight mb-4">Activity Feed</h2>
            <GamificationSidebar />
            <InsightsCards />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && <HabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}