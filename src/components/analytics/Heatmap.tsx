import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHeatmapData } from '@/lib/store';
import { format, parseISO } from 'date-fns';
const getColor = (count: number) => {
  if (count === 0) return 'bg-muted/50';
  if (count <= 1) return 'bg-green-200 dark:bg-green-900';
  if (count <= 2) return 'bg-green-400 dark:bg-green-700';
  if (count <= 3) return 'bg-green-600 dark:bg-green-500';
  return 'bg-green-800 dark:bg-green-300';
};
export function Heatmap() {
  const data = useHeatmapData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(i);
    return d.toLocaleString('default', { month: 'short' });
  });
  // Get the first day of the data to align the grid
  const firstDay = data.length > 0 ? parseISO(data[0].date).getDay() : 0;
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Contribution Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {/* Empty cells for alignment */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="w-3.5 h-3.5" />
            ))}
            {data.map(({ date, count }) => (
              <TooltipProvider key={date} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-3.5 h-3.5 rounded-sm ${getColor(count)}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{count} completions on {format(parseISO(date), 'MMM d, yyyy')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="flex justify-between w-full mt-2 text-xs text-muted-foreground px-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/50" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
              <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}