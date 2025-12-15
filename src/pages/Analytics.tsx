import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Heatmap } from '@/components/analytics/Heatmap';
import { HabitStats } from '@/components/analytics/HabitStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
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
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Personalized Insights
                  </CardTitle>
                  <CardDescription>Patterns we've found in your data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">✨ Your mood is 20% higher on days you complete a 'Fitness' habit.</p>
                  <p className="text-sm">🚀 You are most consistent with 'Learning' habits on weekdays.</p>
                  <p className="text-sm">💡 Consider adding a 'Mindfulness' habit to complement your routine.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}