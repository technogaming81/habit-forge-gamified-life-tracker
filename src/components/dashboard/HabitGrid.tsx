import { motion } from 'framer-motion';
import { Flame, PlusCircle } from 'lucide-react';
import { useHabits, useChecks, useHabitActions, Habit } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const HabitCard = ({ habit }: { habit: Habit }) => {
  const checks = useChecks();
  const { checkHabit } = useHabitActions();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const check = checks[`${habit.id}-${todayStr}`];
  const currentValue = check?.value || 0;
  const progress = (currentValue / habit.target) * 100;
  const isCompleted = currentValue >= habit.target;
  const handleCheck = () => {
    if (!isCompleted) {
      checkHabit(habit.id, new Date());
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("rounded-2xl transition-all duration-300", isCompleted ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-card")}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{habit.name}</CardTitle>
              <CardDescription>{habit.description}</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm">{habit.streak}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {habit.target > 1 && (
            <>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground text-center">{currentValue} / {habit.target} {habit.unit}</p>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCheck} disabled={isCompleted} className="w-full rounded-lg">
            {isCompleted ? 'Completed!' : `Check-in (${currentValue}/${habit.target})`}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export function HabitGrid({ openModal }: { openModal: () => void }) {
  const habits = useHabits();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
       <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={openModal}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl text-muted-foreground hover:bg-muted hover:border-primary hover:text-primary transition-all duration-300 min-h-[220px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle className="h-12 w-12 mb-2" />
              <span className="font-semibold">Add New Habit</span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new habit to track</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}