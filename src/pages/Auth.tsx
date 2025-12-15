import { AuthTabs } from "@/components/auth/AuthTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem } from "lucide-react";
import { motion } from "framer-motion";
export function Auth() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-2xl shadow-xl border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Gem className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Habit Forge</h1>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuthTabs />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}