import { useState } from 'react';
import { Trophy, Smile, Badge, Star } from 'lucide-react';
import { useQuests, useBadges, useUserBadges, useHabitActions } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
export function GamificationSidebar() {
  const quests = useQuests();
  const allBadges = useBadges();
  const userBadges = useUserBadges();
  const { logMood } = useHabitActions();
  const [mood, setMood] = useState(0);
  const handleMoodSelect = (rating: number) => {
    setMood(rating);
    logMood(rating);
  };
  const recentUserBadges = allBadges.filter(b => userBadges.includes(b.id)).slice(-3);
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Daily Quests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quests.map((quest) => (
            <div key={quest.id}>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor={`quest-${quest.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {quest.title}
                </label>
                <span className="text-xs text-muted-foreground">
                  {quest.reward.xp} XP / {quest.reward.coins} Coins
                </span>
              </div>
              <Progress value={(quest.current / quest.target) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-blue-500" />
            <span>Mood Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">How are you feeling today?</p>
          <div className="flex justify-around mt-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodSelect(rating)}
                className="text-3xl hover:scale-125 transition-transform duration-200"
              >
                <Star className={cn("h-8 w-8 transition-colors", rating <= mood ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")} />
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="h-5 w-5 text-purple-500" />
            <span>Recent Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentUserBadges.length > 0 ? (
            <div className="flex space-x-4">
              {recentUserBadges.map(badge => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="bg-muted p-3 rounded-full">
                        <badge.icon className="h-6 w-6 text-purple-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{badge.name}</p>
                      <p>{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No new badges earned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}