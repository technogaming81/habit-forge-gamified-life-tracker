import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHabitStore } from '@/lib/store';
import { downloadJSON, downloadCSV } from '@/lib/utils';
import { User, LogOut, Download, Palette, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export function Settings() {
  const navigate = useNavigate();
  const state = useHabitStore.getState();
  const user = state.auth?.user ?? { name: 'Demo User', email: 'demo@habitforge.com' };
  const { logout, updateUser, freshStart } = state.actions;
  const [name, setName] = useState(user.name);
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  const handleExportJSON = () => {
    const { actions, ...exportData } = state;
    downloadJSON(exportData, 'habit-forge-data.json');
    toast.success("Your data has been exported as JSON.");
  };
  const handleExportCSV = () => {
    const { habits, checks, moodLogs } = state;
    downloadCSV(habits, 'habits.csv');
    downloadCSV(Object.values(checks), 'checks.csv');
    downloadCSV(moodLogs, 'moodLogs.csv');
    toast.success("Your data has been exported as CSV files.");
  };
  const handleProfileUpdate = () => {
    updateUser(name);
    toast.success("Profile updated successfully!");
  };
  const handleFreshStart = () => {
    freshStart();
    navigate('/dashboard');
  };
  return (
    <DashboardLayout>
      <div className="py-8 md:py-10 lg:py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Settings</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Profile</CardTitle>
              <CardDescription>Manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} readOnly disabled />
              </div>
              <Button onClick={handleProfileUpdate}>Update Profile</Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette /> Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p>Toggle light/dark mode</p>
              <ThemeToggle className="relative" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download /> Data Export</CardTitle>
              <CardDescription>Download all your habit data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleExportJSON} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button onClick={handleExportCSV} className="w-full" variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><RefreshCw /> Fresh Start</CardTitle>
              <CardDescription>Reset all progress and start over. This action is irreversible.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Reset Everything</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your habits, check-ins, stats, and badges. Your account will be reset to day one, and you will see the onboarding tour again. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFreshStart} className="bg-destructive hover:bg-destructive/90">
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LogOut /> Logout</CardTitle>
              <CardDescription>Sign out of your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}