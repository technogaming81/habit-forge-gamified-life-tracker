import { useState } from 'react';
import { MoreVertical, Edit, Archive, Trash2, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useHabitActions } from '@/lib/store';
import { HistoryModal } from '../modals/HistoryModal';
interface HabitActionsProps {
  habitId: string;
  onEdit: () => void;
}
export function HabitActions({ habitId, onEdit }: HabitActionsProps) {
  const { archiveHabit, deleteHabit } = useHabitActions();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Habit actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            <span>View History</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => archiveHabit(habitId)}>
            <Archive className="mr-2 h-4 w-4" />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
      {isHistoryOpen && <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} habitId={habitId} />}
    </>
  );
}