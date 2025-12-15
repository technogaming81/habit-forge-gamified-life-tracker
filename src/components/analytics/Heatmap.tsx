import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHeatmapData } from '@/lib/store';
import { format, parseISO, getDay, startOfWeek, addDays } from 'date-fns';
const getColor = (level: number) => {
  switch (level) {
    case 0: return 'bg-muted/50';
    case 1: return 'bg-green-200 dark:bg-green-900';
    case 2: return 'bg-green-400 dark:bg-green-700';
    case 3: return 'bg-green-600 dark:bg-green-500';
    case 4: return 'bg-green-800 dark:bg-green-300';
    default: return 'bg-muted/50';
  }
};
export function Heatmap() {
  const data = useHeatmapData();
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Contribution Heatmap</CardTitle></CardHeader>
        <CardContent><p>No data to display yet. Start tracking habits!</p></CardContent>
      </Card>
    );
  }
  const firstDate = parseISO(data[0].date);
  const dayOffset = getDay(firstDate);
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Contribution Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center overflow-x-auto p-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {Array.from({ length: dayOffset }).map((_, index) => (
              <div key={`empty-${index}`} className="w-3.5 h-3.5" />
            ))}
            {data.map(({ date, count, level }) => (
              <TooltipProvider key={date} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-3.5 h-3.5 rounded-sm ${getColor(level)}`} />
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