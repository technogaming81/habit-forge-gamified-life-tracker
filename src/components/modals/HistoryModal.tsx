import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useChecks, useHabits, Check } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitId: string;
}
const ITEMS_PER_PAGE = 10;
export function HistoryModal({ isOpen, onClose, habitId }: HistoryModalProps) {
  const allChecks = useChecks();
  const habits = useHabits();
  const habit = habits.find(h => h.id === habitId);
  const [currentPage, setCurrentPage] = useState(1);
  const habitChecks = useMemo(() => {
    return Object.values(allChecks)
      .filter((check: Check) => check.habitId === habitId)
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [allChecks, habitId]);
  const totalPages = Math.ceil(habitChecks.length / ITEMS_PER_PAGE);
  const paginatedChecks = habitChecks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Check-in History: {habit?.name}</DialogTitle>
          <DialogDescription>A log of all your completions for this habit.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {paginatedChecks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedChecks.map((check) => (
                  <TableRow key={check.date}>
                    <TableCell>{format(parseISO(check.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">{check.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history yet. Check-in to start your log!</p>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}