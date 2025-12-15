import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, ShoppingCart, Settings, Gem, User, LogOut, Shield, Grid } from 'lucide-react';
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
const NavMenuItem = ({ item }: { item: typeof navItems[0] }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  return (
    <DropdownMenuItem asChild className="min-h-[44px]">
      <NavLink
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none w-full',
          isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.name}</span>
      </NavLink>
    </DropdownMenuItem>
  );
};
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
    <div className="flex min-h-screen w-full flex-col">
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:h-[60px]"
      >
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Gem className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Habit Forge</span>
        </NavLink>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Grid className="h-5 w-5" />
                <span className="sr-only">Switch View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map((item) => <NavMenuItem key={item.name} item={item} />)}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle className="relative top-0 right-0" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account (Level {level})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-between focus:bg-transparent cursor-default">
                <span>Streak Freezes</span>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-blue-500" /> {streakFreezes}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><NavLink to="/settings" className="w-full">Settings</NavLink></DropdownMenuItem>
              <DropdownMenuItem asChild><NavLink to="/shop" className="w-full">Shop</NavLink></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
      <main className="flex flex-1 flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}