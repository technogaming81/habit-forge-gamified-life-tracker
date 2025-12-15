import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from 'zod';
import { Check, MoodLog, Habit } from './store';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const calculateLevelData = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelXp = 100 * Math.pow(level - 1, 2);
  const nextLevelXp = 100 * Math.pow(level, 2);
  const xpForNextLevel = nextLevelXp - currentLevelXp;
  const xpProgress = xp - currentLevelXp;
  const progressPercentage = xpForNextLevel > 0 ? (xpProgress / xpForNextLevel) * 100 : 0;
  return {
    level,
    xpProgress,
    xpForNextLevel,
    progressPercentage,
  };
};
export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
  .regex(/\d/, { message: "Must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." });
export function downloadJSON(data: object, filename: string) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = filename;
  link.click();
}
export function downloadCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(fieldName => JSON.stringify(row[fieldName])).join(',')
    )
  ];
  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
}
export function computeInsights(checks: Record<string, Check>, moodLogs: MoodLog[], habits: Habit[]): string[] {
  const insights: string[] = [];
  if (moodLogs.length < 3 || habits.length === 0) return ["Track more moods and habits to unlock insights!"];
  const moodByDate = new Map(moodLogs.map(log => [log.date, log.rating]));
  const checksByDate = Object.values(checks).reduce((acc, check) => {
    if (!acc[check.date]) acc[check.date] = [];
    acc[check.date].push(check);
    return acc;
  }, {} as Record<string, Check[]>);
  const categoryMoods: Record<string, { totalRating: number; count: number }> = {};
  for (const date of Object.keys(checksByDate)) {
    if (moodByDate.has(date)) {
      const mood = moodByDate.get(date)!;
      const completedHabitIds = new Set(checksByDate[date].map(c => c.habitId));
      completedHabitIds.forEach(habitId => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          if (!categoryMoods[habit.category]) {
            categoryMoods[habit.category] = { totalRating: 0, count: 0 };
          }
          categoryMoods[habit.category].totalRating += mood;
          categoryMoods[habit.category].count++;
        }
      });
    }
  }
  const avgMood = moodLogs.reduce((sum, log) => sum + log.rating, 0) / moodLogs.length;
  for (const category in categoryMoods) {
    if (categoryMoods[category].count > 2) {
      const avgCategoryMood = categoryMoods[category].totalRating / categoryMoods[category].count;
      const diff = ((avgCategoryMood - avgMood) / avgMood) * 100;
      if (Math.abs(diff) > 10) {
        insights.push(`Your mood is ${diff > 0 ? 'up' : 'down'} by ${Math.abs(diff).toFixed(0)}% on days you complete '${category}' habits.`);
      }
    }
  }
  return insights.length > 0 ? insights : ["No strong correlations found yet. Keep tracking!"];
}