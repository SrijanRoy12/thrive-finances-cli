import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(formData.username, formData.password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/80 border-0 shadow-2xl animate-scale-in">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base">
          Sign in to your account to continue your financial journey
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 animate-fade-in animation-delay-100">
            <Label htmlFor="username" className="text-sm font-medium">Username or Email</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={handleChange}
              required
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
            />
          </div>
          
          <div className="space-y-2 animate-fade-in animation-delay-200">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-primary hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-300" 
            disabled={isLoading}
          >
            <div className="flex items-center justify-center">
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </div>
          </Button>

          <div className="text-center text-sm animate-fade-in animation-delay-400">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium transition-all duration-200 hover:text-primary/80"
            >
              Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};