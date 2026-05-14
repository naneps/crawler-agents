import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldAlert, 
  CreditCard,
  MoreVertical,
  Activity,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, planRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/plans')
      ]);
      setUsers(userRes.data.users);
      setPlans(planRes.data.plans);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (userId, planName) => {
    setUpdatingUserId(userId);
    try {
      await axios.post(`/api/admin/users/${userId}/plan`, { planName });
      fetchData();
    } catch (e) {
      alert(e.response?.data?.message || 'Error updating plan');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <Activity className="w-10 h-10 text-primary animate-spin opacity-20" />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="p-6 md:p-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
              <Users className="w-5 h-5 text-primary" />
              Node Operators
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider opacity-70">
              Oversee user access, roles, and intelligence quotas
            </p>
          </div>
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search operators..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-11 pl-10 rounded-xl bg-muted/40 border-none text-[10px] font-black uppercase tracking-widest focus-visible:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-border/50">
                  <TableHead className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Operator</TableHead>
                  <TableHead className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Clearance</TableHead>
                  <TableHead className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Protocol</TableHead>
                  <TableHead className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Deployment</TableHead>
                  <TableHead className="h-10 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Ops</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(u => {
                  const activeSub = u.subscriptions?.[0];
                  const currentPlan = activeSub?.plan?.name || 'free';
                  
                  return (
                    <TableRow key={u.id} className="group hover:bg-muted/30 transition-colors border-border/50">
                      <TableCell className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border group-hover:border-primary/20 transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-black text-foreground text-[11px] tracking-tight uppercase">{u.username}</p>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">ID: {u.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge className={cn(
                          "text-[8px] font-black tracking-widest uppercase border-none px-2 py-0.5 rounded-md",
                          u.role === 'admin' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {u.role === 'admin' ? <Shield className="w-2.5 h-2.5 mr-1" /> : null}
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <div className="flex flex-col gap-1.5">
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit">
                             <Zap className="w-2.5 h-2.5 mr-1" /> {currentPlan}
                           </Badge>
                           <div className="flex flex-col gap-1 w-24">
                              <div className="flex justify-between text-[7px] font-black uppercase tracking-tighter text-muted-foreground/80">
                                 <span>{u.usage} / {u.planLimit}</span>
                                 <span>{Math.round((u.usage / u.planLimit) * 100)}%</span>
                              </div>
                              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                 <div 
                                   className={cn(
                                     "h-full rounded-full transition-all duration-1000",
                                     (u.usage / u.planLimit) > 0.9 ? "bg-destructive" : "bg-primary"
                                   )} 
                                   style={{ width: `${Math.min(100, (u.usage / u.planLimit) * 100)}%` }} 
                                 />
                              </div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <div className="flex items-center gap-2 text-muted-foreground font-black text-[9px] opacity-70 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            className="bg-muted/50 border border-border/50 rounded-md h-7 px-2 text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-primary/30 outline-none disabled:opacity-50"
                            value={currentPlan}
                            disabled={updatingUserId === u.id}
                            onChange={(e) => handleUpdatePlan(u.id, e.target.value)}
                          >
                            {plans.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
