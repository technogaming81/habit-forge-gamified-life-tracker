import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserHeader } from '@/components/dashboard/UserHeader';
import { HabitGrid } from '@/components/dashboard/HabitGrid';
import { GamificationSidebar } from '@/components/dashboard/GamificationSidebar';
import { CreateHabitModal } from '@/components/modals/CreateHabitModal';
export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <UserHeader />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Today's Habits</h2>
            <HabitGrid openModal={() => setIsModalOpen(true)} />
          </div>
          <div className="lg:col-span-1">
             <h2 className="text-2xl font-bold tracking-tight mb-4">Gamification</h2>
            <GamificationSidebar />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}