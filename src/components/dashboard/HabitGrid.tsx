import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, PlusCircle, GripVertical } from 'lucide-react';
import { useHabits, useChecks, useHabitActions, Habit } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const SortableHabitCard = ({ habit }: { habit: Habit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: habit.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
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
    <div ref={setNodeRef} style={style}>
      <Card className={cn("rounded-2xl transition-all duration-300 relative", isCompleted ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-card")}>
        <div {...attributes} {...listeners} className="absolute top-3 right-3 cursor-grab p-2 text-muted-foreground/50 hover:text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg pr-8">{habit.name}</CardTitle>
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
    </div>
  );
};
export function HabitGrid({ openModal }: { openModal: () => void }) {
  const habits = useHabits();
  const { reorderHabits } = useHabitActions();
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = habits.findIndex((h) => h.id === active.id);
      const newIndex = habits.findIndex((h) => h.id === over.id);
      reorderHabits(arrayMove(habits, oldIndex, newIndex));
    }
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={habits} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {habits.map((habit) => (
            <SortableHabitCard key={habit.id} habit={habit} />
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
      </SortableContext>
    </DndContext>
  );
}