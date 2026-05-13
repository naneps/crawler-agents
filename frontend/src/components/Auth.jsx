import { useState } from 'react';
import axios from 'axios';
import { Shield, Lock, User, Activity, AlertCircle, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth({ onLogin, theme, toggleTheme }) {
  const [authView, setAuthView] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = authView === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(endpoint, formData);
      if (res.data.success) {
        if (authView === 'register') {
          setAuthView('login');
          setFormData({ username: '', password: '' });
          alert('Registration successful! Please login.');
        } else {
          onLogin();
        }
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="absolute top-8 right-8 z-50">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-10 w-10">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <Card className="w-full max-w-[400px] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative z-10 rounded-2xl overflow-hidden">
        <CardHeader className="text-center space-y-3 pb-8 pt-10">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tighter uppercase">
              CrawlGen <span className="text-primary">Intelligence</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              Neural Network Access Node
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={authView} onValueChange={setAuthView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-10 p-1">
              <TabsTrigger value="login" className="text-[10px] font-black uppercase tracking-widest h-8">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-[10px] font-black uppercase tracking-widest h-8">Register</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-wider p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Input
                  required
                  placeholder="admin@crawlgen.ai"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 h-11 text-xs font-bold bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-11 text-xs font-bold bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            <Button disabled={loading} className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4">
              {loading ? <Activity className="w-4 h-4 animate-spin" /> : (authView === 'login' ? 'Establish Neural Link' : 'Initialize Identity')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-8 pt-2 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Encrypted Channel Active</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
