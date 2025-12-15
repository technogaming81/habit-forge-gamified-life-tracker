import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, subDays, isYesterday, isToday, parseISO } from 'date-fns';
import { Award, Flame, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { computeInsights } from './utils';
// Types
export type HabitType = 'positive' | 'negative';
export type HabitFrequency = 'daily' | 'weekly' | 'specific_days';
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: HabitType;
  frequency: HabitFrequency;
  days?: number[]; // 0-6 for Sunday-Saturday
  target: number;
  unit?: string;
  streak: number;
  lastChecked: string | null; // YYYY-MM-DD
  archived: boolean;
}
export interface UserStats {
  xp: number;
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
  note?: string;
}
export interface MoodLog {
  date: string; // YYYY-MM-DD
  rating: number; // 1-5
}
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
}
export interface HeatmapData {
  date: string;
  count: number;
  level: number;
}
export interface User {
  name: string;
  email: string;
}
// Store State Interface
interface HabitState {
  auth: {
    loggedIn: boolean;
    user: User | null;
  };
  userStats: UserStats;
  habits: Habit[];
  quests: Quest[];
  checks: Record<string, Check>; // key: `habitId-YYYY-MM-DD`
  moodLogs: MoodLog[];
  badges: Badge[];
  userBadges: string[];
  shopItems: ShopItem[];
  actions: {
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    checkHabit: (habitId: string, date: Date) => void;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastChecked' | 'archived'>) => void;
    editHabit: (habit: Habit) => void;
    deleteHabit: (habitId: string) => void;
    archiveHabit: (habitId: string) => void;
    reorderHabits: (habits: Habit[]) => void;
    logMood: (rating: number) => void;
    purchaseItem: (itemId: string) => boolean;
  };
}
// Mock Data for initial state
const MOCK_HABITS: Habit[] = [
  { id: '1', name: 'Read 10 pages', description: 'Read from a book for self-improvement.', category: 'Learning', type: 'positive', frequency: 'daily', target: 10, unit: 'pages', streak: 5, lastChecked: format(subDays(new Date(), 1), 'yyyy-MM-dd'), archived: false },
  { id: '2', name: 'Morning Run', description: '30-minute run to start the day.', category: 'Fitness', type: 'positive', frequency: 'specific_days', days: [1, 3, 5], target: 1, unit: 'run', streak: 12, lastChecked: format(subDays(new Date(), 2), 'yyyy-MM-dd'), archived: false },
  { id: '3', name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day.', category: 'Health', type: 'positive', frequency: 'daily', target: 8, unit: 'glasses', streak: 2, lastChecked: format(subDays(new Date(), 1), 'yyyy-MM-dd'), archived: false },
  { id: '4', name: 'No Junk Food', description: 'Avoid eating processed junk food.', category: 'Health', type: 'negative', frequency: 'daily', target: 1, unit: 'day', streak: 3, lastChecked: format(subDays(new Date(), 1), 'yyyy-MM-dd'), archived: false },
];
const MOCK_QUESTS: Quest[] = [
  { id: 'q1', title: 'Complete 3 habits', target: 3, current: 1, completed: false, reward: { xp: 50, coins: 10 } },
  { id: 'q2', title: 'Achieve a 5-day streak', target: 1, current: 0, completed: false, reward: { xp: 100, coins: 20 } },
  { id: 'q3', title: 'Log your mood', target: 1, current: 0, completed: false, reward: { xp: 20, coins: 5 } },
];
const ALL_BADGES: Badge[] = [
    { id: 'streak_5', name: '5-Day Streak', description: 'Kept a habit for 5 days straight!', icon: Flame },
    { id: 'streak_10', name: '10-Day Streak', description: 'Two work weeks of consistency!', icon: Flame },
    { id: 'first_quest', name: 'Quest Complete', description: 'Completed your first daily quest.', icon: Zap },
    { id: 'perfect_week', name: 'Perfect Week', description: 'Completed all daily habits for 7 days.', icon: Award },
];
const MOCK_SHOP_ITEMS: ShopItem[] = [
    { id: 'streak_freeze', name: 'Streak Freeze', description: 'Protect a streak for one day of inactivity.', cost: 150 },
    { id: 'avatar_theme_1', name: 'Cosmic Theme', description: 'A new look for your profile.', cost: 300 },
];
// Zustand Store with Persistence
export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      auth: { loggedIn: false, user: null },
      userStats: { xp: 1250, coins: 250, streakFreezes: 2 },
      habits: MOCK_HABITS,
      quests: MOCK_QUESTS,
      checks: {
        [`3-${format(new Date(), 'yyyy-MM-dd')}`]: { habitId: '3', date: format(new Date(), 'yyyy-MM-dd'), value: 4 }
      },
      moodLogs: [],
      badges: ALL_BADGES,
      userBadges: [],
      shopItems: MOCK_SHOP_ITEMS,
      actions: {
        login: (email, pass) => {
          if (email === 'demo@habitforge.com' && pass === 'Password123!') {
            set({ auth: { loggedIn: true, user: { name: 'Demo User', email } } });
            return true;
          }
          return false;
        },
        logout: () => set({ auth: { loggedIn: false, user: null } }),
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
            const xpGained = 10 + Math.min(habit.streak, 10);
            const coinsGained = 5;
            state.userStats.xp += xpGained;
            state.userStats.coins += coinsGained;
            if (check.value >= habit.target) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              const lastCheckedDate = habit.lastChecked ? parseISO(habit.lastChecked) : null;
              if (lastCheckedDate && isYesterday(lastCheckedDate)) {
                habit.streak += 1;
              } else if (!lastCheckedDate || !isToday(lastCheckedDate)) {
                habit.streak = 1;
              }
              habit.lastChecked = dateStr;
              if (habit.streak === 5 && !state.userBadges.includes('streak_5')) {
                state.userBadges.push('streak_5');
              }
            }
          }
        })),
        addHabit: (newHabit) => set(produce((state: HabitState) => {
            const habit: Habit = {
                ...newHabit,
                id: Date.now().toString(),
                streak: 0,
                lastChecked: null,
                archived: false,
            };
            state.habits.push(habit);
        })),
        editHabit: (updatedHabit) => set(produce((state: HabitState) => {
            const index = state.habits.findIndex(h => h.id === updatedHabit.id);
            if (index !== -1) {
                state.habits[index] = updatedHabit;
            }
        })),
        deleteHabit: (habitId) => set(produce((state: HabitState) => {
            state.habits = state.habits.filter(h => h.id !== habitId);
        })),
        archiveHabit: (habitId) => set(produce((state: HabitState) => {
            const habit = state.habits.find(h => h.id === habitId);
            if (habit) {
                habit.archived = !habit.archived;
            }
        })),
        reorderHabits: (newHabits) => set({ habits: newHabits }),
        logMood: (rating) => set(produce((state: HabitState) => {
            const dateStr = format(new Date(), 'yyyy-MM-dd');
            const existingLogIndex = state.moodLogs.findIndex(log => log.date === dateStr);
            if (existingLogIndex > -1) {
                state.moodLogs[existingLogIndex].rating = rating;
            } else {
                state.moodLogs.push({ date: dateStr, rating });
            }
        })),
        purchaseItem: (itemId) => {
            const { userStats, shopItems } = get();
            const item = shopItems.find(i => i.id === itemId);
            if (item && userStats.coins >= item.cost) {
                set(produce((state: HabitState) => {
                    state.userStats.coins -= item.cost;
                    if (item.id === 'streak_freeze') {
                        state.userStats.streakFreezes += 1;
                    }
                }));
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                return true;
            }
            return false;
        }
      },
    }),
    {
      name: 'habit-forge-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ...state, actions: {} }), // Don't persist actions
    }
  )
);
// Selectors
export const useAuth = () => useHabitStore(s => s.auth);
export const useUserStats = () => useHabitStore(s => s.userStats);
export const useHabits = () => useHabitStore(s => s.habits);
export const useQuests = () => useHabitStore(s => s.quests);
export const useChecks = () => useHabitStore(s => s.checks);
export const useMoodLogs = () => useHabitStore(s => s.moodLogs);
export const useBadges = () => useHabitStore(s => s.badges);
export const useUserBadges = () => useHabitStore(s => s.userBadges);
export const useShopItems = () => useHabitStore(s => s.shopItems);
export const useHabitActions = () => useHabitStore(s => s.actions);
// Derived Data Selectors
export const useHeatmapData = (): HeatmapData[] => {
  const checks = useChecks();
  const habits = useHabits();
  const checksByDate = Object.values(checks).reduce((acc, check) => {
    acc[check.date] = (acc[check.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const data: HeatmapData[] = [];
  for (let i = 364; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = checksByDate[dateStr] || 0;
    const totalHabits = habits.filter(h => !h.archived).length || 1;
    const completionRate = count / totalHabits;
    let level = 0;
    if (completionRate > 0) level = 1;
    if (completionRate >= 0.25) level = 2;
    if (completionRate >= 0.5) level = 3;
    if (completionRate >= 0.75) level = 4;
    data.push({ date: dateStr, count, level });
  }
  return data;
};
export const useInsights = (): string[] => {
  const checks = useChecks();
  const moodLogs = useMoodLogs();
  const habits = useHabits();
  return computeInsights(checks, moodLogs, habits);
};