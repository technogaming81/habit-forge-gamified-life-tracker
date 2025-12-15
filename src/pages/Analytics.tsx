import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Heatmap } from '@/components/analytics/Heatmap';
import { HabitStats } from '@/components/analytics/HabitStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightsCards } from '@/components/dashboard/InsightsCards';
export function Analytics() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Analytics Hub</h1>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Habit Stats</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Heatmap />
            </TabsContent>
            <TabsContent value="stats">
              <HabitStats />
            </TabsContent>
            <TabsContent value="insights">
              <InsightsCards />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}