import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInsights } from '@/lib/store';
import { motion } from 'framer-motion';
export function InsightsCards() {
  const insights = useInsights();
  if (!insights || insights.length === 0) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="rounded-2xl shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span>Personalized Insights</span>
          </CardTitle>
          <CardDescription>Patterns we've found in your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.map((insight, index) => (
            <p key={index} className="text-sm">✨ {insight}</p>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}