import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/lib/store';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const steps = [
  {
    title: "Welcome to Habit Forge!",
    description: "Let's quickly walk through the key features to get you started on your journey of self-improvement.",
  },
  {
    title: "Step 1: Create a Habit",
    description: "Your dashboard is where you'll see your daily habits. Click the 'Add New Habit' button to create your first one. Give it a name, set a goal, and you're ready to go!",
  },
  {
    title: "Step 2: Track Your Progress",
    description: "Each day, simply click the 'Check-in' button on a habit card. You'll earn XP and Coins for every completion, filling up your level bar and unlocking rewards.",
  },
  {
    title: "Step 3: Stay Motivated",
    description: "Keep an eye on the 'Activity Feed' for daily quests and new badges. Use your coins in the Shop to buy items like Streak Freezes. You're all set!",
  },
];
export function OnboardingTour() {
  const isFirstLogin = useHabitStore(s => s.firstLogin);
  const completeOnboarding = useHabitStore(s => s.actions.completeOnboarding);
  const [step, setStep] = useState(0);
  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));
  const handleFinish = () => {
    completeOnboarding();
  };
  return (
    <Sheet open={isFirstLogin} onOpenChange={(open) => !open && handleFinish()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Start Guide</SheetTitle>
          <SheetDescription>
            Step {step + 1} of {steps.length}
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 h-[calc(100%-150px)] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold mb-4">{steps[step].title}</h3>
              <p className="text-muted-foreground">{steps[step].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <SheetFooter>
          <div className="w-full flex justify-between">
            {step > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Get Started!
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}