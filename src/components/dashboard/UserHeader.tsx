import { Gem, Coins, Shield } from 'lucide-react';
import { useUserStats } from '@/lib/store';
import { calculateLevelData } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function UserHeader() {
  const { xp, coins, streakFreezes } = useUserStats();
  const { level, xpProgress, xpForNextLevel, progressPercentage } = calculateLevelData(xp);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level</CardTitle>
          <Gem className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Level {level}</div>
          <p className="text-xs text-muted-foreground">
            {xpProgress.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{progressPercentage.toFixed(0)}% to next level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coins</CardTitle>
          <Coins className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{coins.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Spend in the shop</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Streak Freezes</CardTitle>
          <Shield className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streakFreezes}</div>
          <p className="text-xs text-muted-foreground">Protects your streaks</p>
        </CardContent>
      </Card>
    </div>
  );
}