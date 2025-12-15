import { useState } from 'react';
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
import { useHabitActions, HabitFrequency, HabitType } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CreateHabitModal({ isOpen, onClose }: CreateHabitModalProps) {
  const { addHabit } = useHabitActions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Health');
  const [type, setType] = useState<HabitType>('positive');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState('');
  const handleSubmit = () => {
    if (!name) return;
    addHabit({
      name,
      description,
      category,
      type,
      frequency,
      target,
      unit,
    });
    onClose();
    // Reset form
    setName('');
    setDescription('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Forge a new habit to improve your life. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g. Morning Run" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="e.g. 30-minute run" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select onValueChange={(value: HabitFrequency) => setFrequency(value)} defaultValue={frequency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="specific_days">Specific Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">Target</Label>
            <Input id="target" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Habit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}