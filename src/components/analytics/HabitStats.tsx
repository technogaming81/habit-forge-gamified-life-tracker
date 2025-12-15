import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/lib/store';
const COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444'];
export function HabitStats() {
  const habits = useHabits();
  const completionData = [
    { name: 'Jan', completed: 30 }, { name: 'Feb', completed: 45 },
    { name: 'Mar', completed: 60 }, { name: 'Apr', completed: 50 },
    { name: 'May', completed: 70 }, { name: 'Jun', completed: 85 },
  ];
  const categoryData = habits.reduce((acc, habit) => {
    const existing = acc.find(item => item.name === habit.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: habit.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  const streakData = [
    { name: '0-4 days', value: habits.filter(h => h.streak < 5).length },
    { name: '5-9 days', value: habits.filter(h => h.streak >= 5 && h.streak < 10).length },
    { name: '10+ days', value: habits.filter(h => h.streak >= 10).length },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Completion Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Habit Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Streak Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={streakData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {streakData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}