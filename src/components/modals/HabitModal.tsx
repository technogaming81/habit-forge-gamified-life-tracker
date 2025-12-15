import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHabitActions, Habit } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addYears, startOfDay } from 'date-fns';
const habitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['positive', 'negative']),
  frequency: z.enum(['daily', 'weekly', 'specific_days']),
  days: z.array(z.number()).optional(),
  target: z.number().min(1, 'Target must be at least 1'),
  unit: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
type HabitFormData = z.infer<typeof habitSchema>;
interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit;
}
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const { addHabit, editHabit } = useHabitActions();
  const isEdit = !!habit;
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
  });
  useEffect(() => {
    if (isOpen) {
      if (habit) {
        reset(habit);
      } else {
        reset({
          name: '', description: '', category: 'Health', type: 'positive',
          frequency: 'daily', days: [], target: 1, unit: '',
          startDate: startOfDay(new Date()).toISOString(),
          endDate: startOfDay(addYears(new Date(), 1)).toISOString(),
        });
      }
    }
  }, [habit, isOpen, reset]);
  const frequency = watch('frequency');
  const onSubmit = (data: HabitFormData) => {
    if (isEdit) {
      editHabit({ ...habit, ...data });
    } else {
      addHabit(data);
    }
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of your habit.' : 'Forge a new habit to improve your life.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Morning Run" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="e.g. 30-minute run to start the day" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...register('category')} placeholder="e.g. Fitness" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">X times per week</SelectItem>
                    <SelectItem value="specific_days">Specific days</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {frequency === 'specific_days' && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex gap-2 flex-wrap">
                {weekDays.map((day, index) => (
                  <Controller
                    key={day}
                    name="days"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={field.value?.includes(index)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), index]
                              : (field.value || []).filter((i) => i !== index);
                            field.onChange(newValue);
                          }}
                        />
                        <Label htmlFor={day}>{day}</Label>
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input id="target" type="number" {...register('target', { valueAsNumber: true })} />
              {errors.target && <p className="text-sm text-red-500">{errors.target.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" {...register('unit')} placeholder="e.g., pages, minutes" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Create Habit'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}