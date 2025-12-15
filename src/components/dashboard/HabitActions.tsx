import { Edit3, Archive, Trash2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useHabitActions } from '@/lib/store';
interface HabitActionsProps {
  habitId: string;
  onEdit: () => void;
}
export function HabitActions({ habitId, onEdit }: HabitActionsProps) {
  const { archiveHabit, deleteHabit } = useHabitActions();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit3 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit3 className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => archiveHabit(habitId)}>
          <Archive className="mr-2 h-4 w-4" />
          <span>Archive</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { /* TODO: Add note modal */ }}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Add Note</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
              deleteHabit(habitId);
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}