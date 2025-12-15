import { Trophy, Smile, Badge } from 'lucide-react';
import { useQuests } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
export function GamificationSidebar() {
  const quests = useQuests();
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
            {['😞', '😐', '🙂', '😄', '🤩'].map((emoji, i) => (
              <button key={i} className="text-3xl hover:scale-125 transition-transform duration-200">
                {emoji}
              </button>
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
          <p className="text-sm text-muted-foreground">No new badges earned yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}