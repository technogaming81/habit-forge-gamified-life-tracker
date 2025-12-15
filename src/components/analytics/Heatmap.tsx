import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHeatmapData } from '@/lib/store';
import { format, parseISO, getDay, startOfYear, endOfYear, eachDayOfInterval, subYears, addYears } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const allData = useHeatmapData();
  const [currentYear, setCurrentYear] = useState(new Date());
  const yearData = useMemo(() => {
    const start = startOfYear(currentYear);
    const end = endOfYear(currentYear);
    const daysInYear = eachDayOfInterval({ start, end });
    const dataMap = new Map(allData.map(d => [d.date, d]));
    return daysInYear.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return dataMap.get(dateStr) || { date: dateStr, count: 0, level: 0 };
    });
  }, [currentYear, allData]);
  if (!yearData || yearData.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Contribution Heatmap</CardTitle></CardHeader>
        <CardContent><p>No data to display yet. Start tracking habits!</p></CardContent>
      </Card>
    );
  }
  const firstDate = parseISO(yearData[0].date);
  const dayOffset = getDay(firstDate);
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contribution Heatmap</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(subYears(currentYear, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{format(currentYear, 'yyyy')}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(addYears(currentYear, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center overflow-x-auto p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={format(currentYear, 'yyyy')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-rows-7 grid-flow-col gap-1"
              role="grid"
              aria-label="Habit completion heatmap"
            >
              {Array.from({ length: dayOffset }).map((_, index) => (
                <div key={`empty-${index}`} className="w-3.5 h-3.5" />
              ))}
              {yearData.map(({ date, count, level }) => (
                <TooltipProvider key={date} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3.5 h-3.5 rounded-sm transition-transform duration-150 hover:scale-125 ${getColor(level)}`}
                        role="gridcell"
                        aria-label={`${count} completions on ${format(parseISO(date), 'MMM d, yyyy')}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{count} completions on {format(parseISO(date), 'MMM d, yyyy')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          </AnimatePresence>
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