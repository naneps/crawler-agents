import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Database, 
  TrendingUp, 
  ArrowUpRight,
  Server,
  Cpu,
  RefreshCw,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function PlatformDashboard({ cache, setCache }) {
  const [stats, setStats] = useState(cache.stats);
  const [loading, setLoading] = useState(!cache.stats);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Only show loading shimmer if we don't have cached data
    if (!stats) setLoading(true);
    try {
      const res = await axios.get('/api/admin/stats');
      const newStats = res.data.stats;
      setStats(newStats);
      setCache(prev => ({ ...prev, stats: newStats }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-48 rounded-[2rem]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-[2.5rem]" />
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-[2.5rem]" />
          <Skeleton className="h-[150px] rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );

  const maxHits = Math.max(...(stats?.activity?.map(d => d.hits) || [1]), 100);
  const chartPoints = stats?.activity?.map((day, i) => {
    const x = (i / (stats.activity.length - 1)) * 100;
    const y = 100 - (day.hits / maxHits) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <ScrollArea className="h-full bg-background/50">
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">System Online</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">Platform Analytics</h3>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest max-w-md">Real-time monitoring of global intelligence nodes and neural throughput.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                <Shield className="w-3.5 h-3.5" /> Security Audit
             </Button>
             <Button onClick={fetchStats} className="h-11 w-11 rounded-xl shadow-xl shadow-primary/20">
                <RefreshCw className="w-4 h-4" />
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Neural Nodes" sub="Active Users" value={stats?.totalUsers} icon={Users} color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard label="Intelligence Keys" sub="Provisioned" value={stats?.totalKeys} icon={ShieldCheck} color="text-emerald-500" bg="bg-emerald-500/10" />
          <StatCard label="Total Throughput" sub="Intelligence Hits" value={stats?.totalLogs} icon={Activity} color="text-primary" bg="bg-primary/10" />
          <StatCard label="Live Crawlers" sub="Data Sources" value={stats?.totalSources} icon={Database} color="text-orange-500" bg="bg-orange-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
                <div className="flex items-center justify-between mb-12">
                   <div className="space-y-1">
                      <h4 className="text-lg font-black uppercase tracking-tight">Intelligence Matrix</h4>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Hit Frequency (Last 7 Days)</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Throughput</span>
                      </div>
                   </div>
                </div>

                {/* SVG Chart */}
                <div className="relative h-[240px] w-full mt-10">
                   <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map(line => (
                        <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="currentColor" strokeWidth="0.1" className="text-border" />
                      ))}
                      {/* Area Gradient */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path 
                        d={`M 0,100 ${stats?.activity?.map((d, i) => `L ${(i / (stats.activity.length - 1)) * 100},${100 - (d.hits / maxHits) * 100}`).join(' ')} L 100,100 Z`}
                        fill="url(#chartGradient)"
                      />
                      {/* Line */}
                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                      />
                      {/* Data Points */}
                      {stats?.activity?.map((day, i) => (
                        <circle 
                          key={i} 
                          cx={(i / (stats.activity.length - 1)) * 100} 
                          cy={100 - (day.hits / maxHits) * 100} 
                          r="1" 
                          className="fill-background stroke-primary stroke-[0.5] hover:r-[1.5] transition-all cursor-crosshair"
                        />
                      ))}
                   </svg>
                   
                   {/* X-Axis Labels */}
                   <div className="flex justify-between mt-6 px-1">
                      {stats?.activity?.map((day, i) => (
                        <span key={i} className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-3xl p-6 flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Optimal Load</p>
                      <h5 className="text-sm font-black uppercase tracking-tight">Infrastructure Balanced</h5>
                   </div>
                </div>
                <div className="bg-card border border-border rounded-3xl p-6 flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Layers className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Sync</p>
                      <h5 className="text-sm font-black uppercase tracking-tight">16 Nodes Synchronized</h5>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
             <div className="bg-slate-950 border border-border rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Engine Performance</h4>
                
                <div className="space-y-6">
                   <PerformanceMeter label="CPU Usage" value="12%" width="12%" color="bg-blue-500" />
                   <PerformanceMeter label="Memory Sync" value="45%" width="45%" color="bg-emerald-500" />
                   <PerformanceMeter label="API Latency" value="89%" width="89%" color="bg-primary" />
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Server className="w-4 h-4 text-muted-foreground" />
                         <span className="text-[10px] font-black uppercase text-muted-foreground">Main Cluster</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] uppercase font-black">Running</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Cpu className="w-4 h-4 text-muted-foreground" />
                         <span className="text-[10px] font-black uppercase text-muted-foreground">Neural Engine</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] uppercase font-black">Online</Badge>
                   </div>
                </div>
             </div>

             <div className="bg-primary p-8 rounded-[2.5rem] text-primary-foreground shadow-2xl shadow-primary/30 group cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                <TrendingUp className="w-8 h-8 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Platform Suggestion</p>
                <h5 className="text-lg font-black leading-tight uppercase tracking-tighter">Your Intelligence Node is performing 18% better than last week.</h5>
                <Button className="mt-6 w-full h-12 rounded-xl bg-white text-primary hover:bg-white/90 text-[10px] font-black uppercase tracking-widest">
                   Scale Resources <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </Button>
             </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function StatCard({ label, sub, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6 hover:border-primary/20 transition-all group relative overflow-hidden">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg", bg, color)}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <h4 className="text-4xl font-black tracking-tighter text-foreground">{value || 0}</h4>
        <p className="text-[9px] font-bold uppercase text-muted-foreground/60">{sub}</p>
      </div>
    </div>
  );
}

function PerformanceMeter({ label, value, width, color }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-[10px] font-black text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width }} />
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
