import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Calendar, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};
const FeatureCard = ({ icon: Icon, title, description, index }: { icon: React.ElementType, title: string, description: string, index: number }) => (
  <motion.div custom={index} variants={featureVariants}>
    <Card className="h-full text-center rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Gem className="h-6 w-6 text-primary" />
            <span>Habit Forge</span>
          </div>
          <Button asChild variant="ghost">
            <Link to="/dashboard">Sign In</Link>
          </Button>
        </header>
        <main>
          <section className="text-center py-20 sm:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500">
                Forge Your Best Self
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
                Turn self-improvement into a thrilling RPG. Track habits, earn XP, level up, and unlock your true potential.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 shadow-lg hover:shadow-primary/50 transition-shadow">
                  <Link to="/dashboard">Get Started for Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full text-lg px-8 py-6">
                  <Link to="/dashboard">View Demo</Link>
                </Button>
              </div>
            </motion.div>
          </section>
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                index={0}
                icon={Trophy}
                title="Gamification"
                description="Complete habits to earn XP and coins. Level up to unlock new features and badges."
              />
              <FeatureCard
                index={1}
                icon={TrendingUp}
                title="Advanced Analytics"
                description="Visualize your progress with heatmaps and charts. Understand what drives your success."
              />
              <FeatureCard
                index={2}
                icon={Calendar}
                title="Smart Scheduling"
                description="Set flexible schedules for your habits - daily, weekly, or on specific days."
              />
            </div>
          </motion.section>
        </main>
        <footer className="text-center py-8 border-t">
          <p className="text-muted-foreground">Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
    </div>
  );
}