import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHabitStore } from '@/lib/store';
import { passwordSchema } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: passwordSchema,
});
type FormData = z.infer<typeof formSchema>;
export function AuthTabs() {
  const navigate = useNavigate();
  const login = useHabitStore(s => s.actions.login);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'demo@habitforge.com',
      password: 'Password123!',
    },
  });
  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setTimeout(() => {
      const success = login(data.email, data.password);
      if (success) {
        toast.success('Login successful! Redirecting...');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup" disabled>Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}