import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, subDays, isYesterday, isToday, parseISO, startOfDay, isWithinInterval, addYears } from 'date-fns';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
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
  order: number;
  startDate?: string; // ISO String
  endDate?: string; // ISO String
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
  type: 'habit_completion' | 'streak' | 'mood' | 'category' | 'xp';
  category?: string;
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
  firstLogin: boolean;
  userStats: UserStats;
  habits: Habit[];
  quests: Quest[];
  checks: Record<string, Check>; // key: `habitId-YYYY-MM-DD`
  moodLogs: MoodLog[];
  badges: Badge[];
  userBadges: string[];
  shopItems: ShopItem[];
  lastVisitDate: string | null;
  actions: {
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    checkHabit: (habitId: string, date: Date) => void;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastChecked' | 'archived' | 'order'>) => void;
    editHabit: (habit: Habit) => void;
    deleteHabit: (habitId: string) => void;
    archiveHabit: (habitId: string) => void;
    reorderHabits: (habits: Habit[]) => void;
    logMood: (rating: number) => void;
    purchaseItem: (itemId: string) => boolean;
    dailyReset: () => void;
    updateUser: (name: string) => void;
    completeOnboarding: () => void;
    freshStart: () => void;
  };
}
const ALL_BADGES: Badge[] = [
    { id: 'streak_7', name: '7-Day Streak', description: 'Kept a habit for 7 days straight!' },
    { id: 'streak_30', name: '30-Day Streak', description: 'A full month of consistency!' },
    { id: 'first_quest', name: 'Quest Complete', description: 'Completed your first daily quest.' },
    { id: 'perfect_week', name: 'Perfect Week', description: 'Completed all daily habits for 7 days.' },
    { id: 'early_bird', name: 'Early Bird', description: 'Completed a habit before 8 AM.' },
    { id: 'night_owl', name: 'Night Owl', description: 'Completed a habit after 9 PM.' },
];
const MOCK_SHOP_ITEMS: ShopItem[] = [
    { id: 'streak_freeze', name: 'Streak Freeze', description: 'Protect a streak for one day of inactivity.', cost: 150 },
    { id: 'avatar_theme_1', name: 'Cosmic Theme', description: 'A new look for your profile.', cost: 300 },
];
const questTemplates = [
    { title: 'Complete 3 habits', target: 3, reward: { xp: 50, coins: 10 }, type: 'habit_completion' },
    { title: 'Complete 5 habits', target: 5, reward: { xp: 100, coins: 20 }, type: 'habit_completion' },
    { title: 'Achieve a 3-day streak', target: 3, reward: { xp: 75, coins: 15 }, type: 'streak' },
    { title: 'Achieve a 7-day streak', target: 7, reward: { xp: 150, coins: 30 }, type: 'streak' },
    { title: 'Log your mood', target: 1, reward: { xp: 20, coins: 5 }, type: 'mood' },
    { title: 'Log your mood 3 times', target: 3, reward: { xp: 60, coins: 15 }, type: 'mood' },
    { title: 'Earn 100 XP', target: 100, reward: { xp: 25, coins: 5 }, type: 'xp' },
    { title: 'Earn 250 XP', target: 250, reward: { xp: 50, coins: 10 }, type: 'xp' },
    { title: 'Complete a ${category} habit', target: 1, reward: { xp: 30, coins: 5 }, type: 'category' },
    { title: 'Complete 2 ${category} habits', target: 2, reward: { xp: 60, coins: 10 }, type: 'category' },
    { title: 'Check in to every habit once', target: -1, reward: { xp: 100, coins: 25 }, type: 'habit_completion' }, // -1 target means all habits
    { title: 'Maintain a perfect day', target: -1, reward: { xp: 120, coins: 30 }, type: 'habit_completion' },
];
const generateQuests = (habits: Habit[]): Quest[] => {
    const userCategories = [...new Set(habits.map(h => h.category).filter(Boolean))];
    const availableTemplates = questTemplates.map(q => {
        if (q.type === 'category') {
            if (userCategories.length > 0) {
                const category = userCategories[Math.floor(Math.random() * userCategories.length)];
                return { ...q, title: q.title.replace('${category}', category), category };
            }
            return null; // Can't generate this quest if no categories
        }
        if (q.target === -1) {
            return { ...q, target: habits.filter(h => !h.archived).length };
        }
        return q;
    }).filter(Boolean) as (Omit<Quest, 'id' | 'current' | 'completed'>)[];
    return availableTemplates
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((q, i) => ({ ...q, id: `${Date.now()}-${i}`, current: 0, completed: false }));
};
const checkAndAwardBadges = (state: HabitState) => {
    const newBadges: string[] = [];
    const award = (id: string) => {
        if (!state.userBadges.includes(id)) {
            newBadges.push(id);
            state.userBadges.push(id);
        }
    };
    // Streak badges
    state.habits.forEach(h => {
        if (h.streak >= 7) award('streak_7');
        if (h.streak >= 30) award('streak_30');
    });
    // Quest badge
    if (state.quests.some(q => q.completed) && !state.userBadges.includes('first_quest')) {
        award('first_quest');
    }
    // Time-based badges
    const hour = new Date().getHours();
    if (hour < 8) award('early_bird');
    if (hour > 21) award('night_owl');
    if (newBadges.length > 0) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        const badgeNames = newBadges.map(id => state.badges.find(b => b.id === id)?.name).filter(Boolean);
        toast.success(`Badge${badgeNames.length > 1 ? 's' : ''} Unlocked: ${badgeNames.join(', ')}!`);
    }
};
const updateQuests = (state: HabitState, habit?: Habit, xpGained: number = 0) => {
    let questCompleted = false;
    const maxStreak = Math.max(0, ...state.habits.map(h => h.streak));
    state.quests.forEach(q => {
        if (q.completed) return;
        let progress = false;
        switch (q.type) {
            case 'habit_completion': if (habit) { q.current++; progress = true; } break;
            case 'category': if (habit && habit.category === q.category) { q.current++; progress = true; } break;
            case 'mood': if (!habit) { q.current++; progress = true; } break;
            case 'streak': q.current = Math.min(q.target, maxStreak); if (q.current > 0) progress = true; break;
            case 'xp': q.current += xpGained; if (xpGained > 0) progress = true; break;
        }
        if (progress && q.current >= q.target) {
            q.completed = true;
            state.userStats.xp += q.reward.xp;
            state.userStats.coins += q.reward.coins;
            toast.info(`Quest Complete: ${q.title}!`, {
                description: `+${q.reward.xp} XP, +${q.reward.coins} Coins`,
            });
            questCompleted = true;
        }
    });
    if (questCompleted) {
        checkAndAwardBadges(state);
        // Endless quests: if all are complete, generate a new set
        if (state.quests.every(q => q.completed)) {
            state.quests = generateQuests(state.habits);
            toast.success("New quests unlocked!");
        }
    }
};
// Zustand Store with Persistence
export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      auth: { loggedIn: false, user: null },
      firstLogin: false,
      userStats: { xp: 0, coins: 0, streakFreezes: 0 },
      habits: [],
      quests: [],
      checks: {},
      moodLogs: [],
      badges: ALL_BADGES,
      userBadges: [],
      shopItems: MOCK_SHOP_ITEMS,
      lastVisitDate: null,
      actions: {
        login: (email, pass) => {
          if (email === 'demo@habitforge.com' && pass === 'Password123!') {
            const isNewUser = !get().lastVisitDate; // Simple check for new user
            set(produce((state: HabitState) => {
              state.auth = { loggedIn: true, user: { name: 'Demo User', email } };
              if (isNewUser) {
                state.firstLogin = true;
                state.userStats = { xp: 0, coins: 0, streakFreezes: 0 };
                state.quests = generateQuests(state.habits);
                state.habits = [];
                state.checks = {};
                state.moodLogs = [];
                state.userBadges = [];
              }
            }));
            get().actions.dailyReset();
            return true;
          }
          return false;
        },
        logout: () => set({ auth: { loggedIn: false, user: null } }),
        checkHabit: (habitId, date) => set(produce((state: HabitState) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const habit = state.habits.find(h => h.id === habitId);
          if (!habit) return;
          // Date Range Validation
          const startDate = habit.startDate ? startOfDay(parseISO(habit.startDate)) : new Date(0);
          const endDate = habit.endDate ? startOfDay(parseISO(habit.endDate)) : addYears(new Date(), 100);
          if (!isWithinInterval(startOfDay(date), { start: startDate, end: endDate })) {
            toast.error("Cannot check habit outside its active date range.");
            return;
          }
          // Frequency Validation
          if (habit.frequency === 'specific_days') {
            const today = date.getDay();
            if (!habit.days?.includes(today)) {
              toast.error("Not scheduled for today!");
              return;
            }
          }
          const checkKey = `${habitId}-${dateStr}`;
          let check = state.checks[checkKey];
          if (!check) {
            check = { habitId, date: dateStr, value: 0 };
          }
          const isCompleted = check.value >= habit.target;
          if (isCompleted) return;
          check.value += 1;
          state.checks[checkKey] = check;
          const justCompleted = check.value >= habit.target;
          let xpGained = 0;
          if (habit.type === 'positive') {
            xpGained = 10 + Math.min(habit.streak, 10);
            const coinsGained = 5;
            state.userStats.xp += xpGained;
            state.userStats.coins += coinsGained;
          }
          updateQuests(state, undefined, xpGained);
          if (justCompleted) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            const lastCheckedDate = habit.lastChecked ? parseISO(habit.lastChecked) : null;
            if (lastCheckedDate && isYesterday(startOfDay(lastCheckedDate))) {
              habit.streak += 1;
            } else if (!lastCheckedDate || !isToday(startOfDay(lastCheckedDate))) {
              const daysBetween = lastCheckedDate ? Math.round((startOfDay(date).getTime() - startOfDay(lastCheckedDate).getTime()) / (1000 * 60 * 60 * 24)) : 99;
              if (daysBetween > 1 && state.userStats.streakFreezes > 0) {
                  state.userStats.streakFreezes--;
                  toast.info(`Streak preserved! A streak freeze was used for ${habit.name}.`);
              } else {
                  habit.streak = 1;
              }
            }
            habit.lastChecked = dateStr;
            updateQuests(state, habit);
            checkAndAwardBadges(state);
          }
        })),
        addHabit: (newHabit) => set(produce((state: HabitState) => {
            const maxOrder = Math.max(0, ...state.habits.map(h => h.order));
            const habit: Habit = {
                ...newHabit,
                id: Date.now().toString(),
                streak: 0,
                lastChecked: null,
                archived: false,
                order: maxOrder + 1,
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
        reorderHabits: (newHabits) => set(produce((state: HabitState) => {
            const reorderedWithOrder = newHabits.map((h, index) => ({...h, order: index}));
            state.habits = reorderedWithOrder;
        })),
        logMood: (rating) => set(produce((state: HabitState) => {
            const dateStr = format(new Date(), 'yyyy-MM-dd');
            const existingLogIndex = state.moodLogs.findIndex(log => log.date === dateStr);
            if (existingLogIndex > -1) {
                state.moodLogs[existingLogIndex].rating = rating;
            } else {
                state.moodLogs.push({ date: dateStr, rating });
            }
            updateQuests(state);
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
        },
        dailyReset: () => {
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            if (get().lastVisitDate !== todayStr) {
                set(produce((state: HabitState) => {
                    state.lastVisitDate = todayStr;
                    state.quests = generateQuests(state.habits);
                    toast.info("Your daily quests have been refreshed!");
                }));
            }
        },
        updateUser: (name: string) => set(produce((state: HabitState) => {
            if (state.auth.user) {
                state.auth.user.name = name;
            }
        })),
        completeOnboarding: () => set({ firstLogin: false }),
        freshStart: () => {
            set(produce((state: HabitState) => {
                state.habits = [];
                state.checks = {};
                state.moodLogs = [];
                state.userBadges = [];
                state.quests = [];
                state.userStats = { xp: 0, coins: 0, streakFreezes: 0 };
                state.firstLogin = true;
            }));
            localStorage.removeItem('habit-forge-storage');
            toast.success("Fresh start activated! Welcome back to Day One. 🎉");
        },
      },
    }),
    {
      name: 'habit-forge-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { actions, ...rest } = state;
        return rest;
      },
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
export const useIsFirstLogin = () => useHabitStore(s => s.firstLogin);
export const useAllQuestsComplete = () => useHabitStore(s => s.quests.length > 0 && s.quests.every(q => q.completed));
// Derived Data Selectors
export const useHeatmapData = (): HeatmapData[] => {
  const checks = useChecks();
  const habits = useHabits();
  const checksByDate = Object.values(checks).reduce((acc, check) => {
    if (check.value > 0) { // Only count completed/progressed checks
        const date = check.date;
        if (!acc[date]) {
            acc[date] = new Set();
        }
        acc[date].add(check.habitId);
    }
    return acc;
  }, {} as Record<string, Set<string>>);
  const data: HeatmapData[] = [];
  for (let i = 364; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const totalHabitsForDay = habits.filter(h => {
        if (h.archived) return false;
        const startDate = h.startDate ? startOfDay(parseISO(h.startDate)) : new Date(0);
        const endDate = h.endDate ? startOfDay(parseISO(h.endDate)) : addYears(new Date(), 100);
        return isWithinInterval(date, { start: startDate, end: endDate });
    }).length || 1;
    const count = checksByDate[dateStr]?.size || 0;
    const completionRate = count / totalHabitsForDay;
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