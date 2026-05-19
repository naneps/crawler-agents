import { Rss, LayoutDashboard, Database, Terminal, ShieldCheck, User, Users, Zap, LogOut, Sun, Moon, Search, Menu, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Sidebar({ 
  user, activeTab, sources, currentSource, 
  setSidebarOpen, sidebarOpen, handleLogout, theme, toggleTheme 
}) {
  const navigate = useNavigate();

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-background text-slate-600 dark:text-slate-400 border-r border-border transition-all duration-300 lg:relative lg:translate-x-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between px-5 shrink-0 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 overflow-hidden shadow-lg shadow-primary/5">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">CrawlGen</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Menu</p>
              {[
                ...(user.role === 'admin' ? [{ id: 'dashboard', icon: TrendingUp, label: 'Platform Analytics', path: '/admin/dashboard' }] : []),
                ...(user.role === 'admin' ? [{ id: 'admin-users', icon: Users, label: 'Users', path: '/admin/users' }] : []),
                ...(user.role === 'admin' ? [{ id: 'admin-plans', icon: Zap, label: 'Plans', path: '/admin/plans' }] : []),
                { id: 'feed', icon: LayoutDashboard, label: 'Feed Explorer', path: '/feed' },
                ...(user.role === 'admin' ? [{ id: 'sources', icon: Database, label: 'Source Management', path: '/sources' }] : []),
                { id: 'docs', icon: Terminal, label: 'API Reference', path: '/docs' },
                { id: 'keys', icon: ShieldCheck, label: 'API Keys', path: '/keys' },
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-[11px] font-black transition-all group uppercase tracking-widest",
                    activeTab === item.id 
                      ? "bg-foreground text-background shadow-md" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === item.id ? "text-background" : "text-primary")} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 mb-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">News Sources</p>
                <Badge variant="outline" className="h-4 px-1 text-[9px] font-black">{Object.keys(sources).length}</Badge>
              </div>
              <div className="space-y-1">
                {Object.entries(sources).map(([id, src]) => (
                  <div 
                    key={id}
                    onClick={() => { navigate(`/feed/${id}`); setSidebarOpen(false); }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[11px] font-bold transition-all group",
                      currentSource === id && activeTab === 'feed' 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={cn(
                        "w-1 h-1 rounded-full transition-all", 
                        currentSource === id && activeTab === 'feed' ? "bg-primary scale-150" : "bg-muted-foreground"
                      )} />
                      <span className="truncate">{src.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-foreground truncate uppercase tracking-tighter">{user.username}</p>
                <p className="text-[8px] text-primary font-black uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}


