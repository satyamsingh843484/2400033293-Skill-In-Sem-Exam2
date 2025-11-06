import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { seedSampleData } from '@/utils/seedData';

const Landing = () => {
  // Seed sample data on component mount
  useEffect(() => {
    seedSampleData();
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Please fill in all fields');
      return;
    }

    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password, role);
      if (!success) {
        toast.error('Invalid credentials');
        return;
      }
    } else {
      success = await signup(formData.name, formData.email, formData.password, role);
      if (!success) {
        toast.error('Email already exists');
        return;
      }
    }

    if (success) {
      toast.success(`Welcome ${isLogin ? 'back' : 'to EduConnect'}!`);
      navigate(role === 'educator' ? '/educator/dashboard' : '/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-accent" />
            <h1 className="text-5xl font-bold ml-3 text-primary-foreground">EduConnect</h1>
          </div>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Empowering educators and students with cutting-edge online learning experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          <Card className="animate-slide-up border-none shadow-xl bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                For Educators
              </CardTitle>
              <CardDescription>Create and manage engaging courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Award className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Build comprehensive course content with multimedia support</p>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Track student progress and performance analytics</p>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Create assignments and provide detailed feedback</p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-none shadow-xl bg-card/95 backdrop-blur" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" />
                For Students
              </CardTitle>
              <CardDescription>Learn at your own pace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Award className="h-5 w-5 text-accent mt-0.5" />
                <p className="text-sm">Access diverse courses across multiple subjects</p>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="h-5 w-5 text-accent mt-0.5" />
                <p className="text-sm">Monitor your learning progress with detailed insights</p>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-accent mt-0.5" />
                <p className="text-sm">Submit assignments and receive personalized feedback</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-md mx-auto animate-scale-in shadow-2xl border-none bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? 'Sign in to continue your learning journey' : 'Create your account to begin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="educator">Educator</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background"
                  />
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
