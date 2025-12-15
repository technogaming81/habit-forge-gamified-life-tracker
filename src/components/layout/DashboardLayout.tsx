import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, ShoppingCart, Settings, Gem, Menu, User, LogOut, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useHabitStore, useUserStats } from '@/lib/store';
import { calculateLevelData } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Shop', href: '/shop', icon: ShoppingCart },
  { name: 'Settings', href: '/settings', icon: Settings },
];
const NavItem = ({ item, index }: { item: typeof navItems[0], index: number }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
          isActive && 'bg-muted text-primary'
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </NavLink>
  </motion.div>
);
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { xp, streakFreezes } = useUserStats();
  const { level } = calculateLevelData(xp);
  const logout = useHabitStore(s => s.actions.logout);
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <Gem className="h-6 w-6 text-primary" />
              <span className="">Habit Forge</span>
            </NavLink>
          </div>
          <nav className="flex-1 grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item, index) => <NavItem key={item.name} item={item} index={index} />)}
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 bg-gradient-to-r from-background to-muted/30">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Gem className="h-6 w-6 text-primary" />
                  <span>Habit Forge</span>
                </NavLink>
                {navItems.map((item, index) => <NavItem key={item.name} item={item} index={index} />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <ThemeToggle className="relative top-0 right-0" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account (Level {level})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-between">
                <span>Streak Freezes</span>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-blue-500" /> {streakFreezes}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><NavLink to="/settings">Settings</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/shop">Shop</NavLink></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}