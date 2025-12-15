import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const calculateLevelData = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 100));
  const currentLevelXp = 100 * Math.pow(level, 2);
  const nextLevelXp = 100 * Math.pow(level + 1, 2);
  const xpForNextLevel = nextLevelXp - currentLevelXp;
  const xpProgress = xp - currentLevelXp;
  const progressPercentage = (xpProgress / xpForNextLevel) * 100;
  return {
    level,
    xpProgress,
    xpForNextLevel,
    progressPercentage,
  };
};