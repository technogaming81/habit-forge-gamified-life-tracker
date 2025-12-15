import { create } from 'zustand';
import { produce } from 'immer';
import { format } from 'date-fns';
export type HabitType = 'positive' | 'negative';
export type HabitFrequency = 'daily' | 'weekly' | 'specific_days';
export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  type: HabitType;
  frequency: HabitFrequency;
  days?: number[]; // 0-6 for Sunday-Saturday
  target: number;
  unit: string;
  streak: number;
  lastChecked: string | null; // YYYY-MM-DD
}
export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  streakFreezes: number;
}
export interface Quest {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  reward: { xp: number; coins: number };
}
export interface Check {
  habitId: string;
  date: string; // YYYY-MM-DD
  value: number;
}
interface HabitState {
  userStats: UserStats;
  habits: Habit[];
  quests: Quest[];
  checks: Record<string, Check>; // key: `habitId-YYYY-MM-DD`
  actions: {
    checkHabit: (habitId: string, date: Date) => void;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastChecked'>) => void;
  };
}
const MOCK_HABITS: Habit[] = [
  { id: '1', name: 'Read 10 pages', description: 'Read from a book for self-improvement.', category: 'Learning', type: 'positive', frequency: 'daily', target: 10, unit: 'pages', streak: 5, lastChecked: format(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd') },
  { id: '2', name: 'Morning Run', description: '30-minute run to start the day.', category: 'Fitness', type: 'positive', frequency: 'specific_days', days: [1, 3, 5], target: 1, unit: 'run', streak: 12, lastChecked: format(new Date().setDate(new Date().getDate() - 2), 'yyyy-MM-dd') },
  { id: '3', name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day.', category: 'Health', type: 'positive', frequency: 'daily', target: 8, unit: 'glasses', streak: 2, lastChecked: format(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd') },
  { id: '4', name: 'No Junk Food', description: 'Avoid eating processed junk food.', category: 'Health', type: 'negative', frequency: 'daily', target: 1, unit: 'day', streak: 3, lastChecked: format(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd') },
  { id: '5', name: 'Code for 1 hour', description: 'Work on a personal project.', category: 'Productivity', type: 'positive', frequency: 'weekly', target: 4, unit: 'sessions', streak: 8, lastChecked: null },
];
const MOCK_QUESTS: Quest[] = [
  { id: 'q1', title: 'Complete 3 habits', target: 3, current: 1, completed: false, reward: { xp: 50, coins: 10 } },
  { id: 'q2', title: 'Achieve a 3-day streak', target: 1, current: 0, completed: false, reward: { xp: 100, coins: 20 } },
  { id: 'q3', title: 'Track your mood', target: 1, current: 0, completed: false, reward: { xp: 20, coins: 5 } },
];
export const useHabitStore = create<HabitState>((set) => ({
  userStats: { xp: 1250, level: 3, coins: 250, streakFreezes: 2 },
  habits: MOCK_HABITS,
  quests: MOCK_QUESTS,
  checks: {
    [`3-${format(new Date(), 'yyyy-MM-dd')}`]: { habitId: '3', date: format(new Date(), 'yyyy-MM-dd'), value: 4 }
  },
  actions: {
    checkHabit: (habitId, date) => set(produce((state: HabitState) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const checkKey = `${habitId}-${dateStr}`;
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) return;
      let check = state.checks[checkKey];
      if (!check) {
        check = { habitId, date: dateStr, value: 0 };
      }
      if (check.value < habit.target) {
        check.value += 1;
        state.checks[checkKey] = check;
        // Gamification logic
        const xpGained = 10 + habit.streak;
        const coinsGained = 5;
        state.userStats.xp += xpGained;
        state.userStats.coins += coinsGained;
        // Quest progress
        state.quests[0].current = Math.min(state.quests[0].target, state.quests[0].current + 1);
        if(state.quests[0].current >= state.quests[0].target) state.quests[0].completed = true;
        if (check.value >= habit.target) {
          habit.lastChecked = dateStr;
          // Simple streak logic for demo
          habit.streak += 1;
        }
      }
    })),
    addHabit: (newHabit) => set(produce((state: HabitState) => {
        const habit: Habit = {
            ...newHabit,
            id: (state.habits.length + 1).toString(),
            streak: 0,
            lastChecked: null,
        };
        state.habits.push(habit);
    })),
  },
}));
export const useUserStats = () => useHabitStore(s => s.userStats);
export const useHabits = () => useHabitStore(s => s.habits);
export const useQuests = () => useHabitStore(s => s.quests);
export const useChecks = () => useHabitStore(s => s.checks);
export const useHabitActions = () => useHabitStore(s => s.actions);