import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHabitStore } from '@/lib/store';
import { downloadJSON } from '@/lib/utils';
import { User, LogOut, Download, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
export function Settings() {
  const navigate = useNavigate();
  const state = useHabitStore();
  const user = state.auth?.user ?? { name: 'Demo User', email: 'demo@habitforge.com' };
  const logoutFn = state.actions.logout;
  const handleLogout = () => {
    logoutFn();
    navigate('/auth');
  };
  const handleExport = () => {
    const exportData = { ...state };
    delete (exportData as any).actions; // Remove actions before exporting
    downloadJSON(exportData, 'habit-forge-data.json');
  };
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full">
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
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} readOnly />
                </div>
                <Button>Update Profile</Button>
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
              <CardContent>
                <Button onClick={handleExport} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export as JSON
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500"><LogOut /> Logout</CardTitle>
                <CardDescription>Sign out of your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}