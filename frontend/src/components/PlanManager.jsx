import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Layers,
  X,
  Save,
  Activity,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export default function PlanManager({ cache, setCache }) {
  const [plans, setPlans] = useState(cache.plans || []);
  const [loading, setLoading] = useState(cache.plans.length === 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    maxRequestsDay: 1000,
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    if (plans.length === 0) setLoading(true);
    try {
      const res = await axios.get('/api/admin/plans');
      setPlans(res.data.plans);
      setCache(prev => ({ ...prev, plans: res.data.plans }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      maxRequestsDay: plan.maxRequestsDay,
      features: Array.isArray(plan.features) ? plan.features : []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/admin/plans/${id}`);
      fetchPlans();
    } catch (e) {
      alert(e.response?.data?.message || 'Error deleting plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/plans', formData);
      setIsModalOpen(false);
      fetchPlans();
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving plan');
    }
  };

  const addFeature = () => {
    if (!newFeature) return;
    setFormData({ ...formData, features: [...formData.features, newFeature] });
    setNewFeature('');
  };

  const removeFeature = (idx) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(idx, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading && plans.length === 0) return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="p-4 md:p-6 shrink-0 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-foreground uppercase">Subscription Plans</h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                Subscription & Quota Control
              </p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setEditingPlan(null);
              setFormData({ name: '', price: 0, maxRequestsDay: 1000, features: [] });
              setIsModalOpen(true);
            }} 
            size="sm"
            className="rounded-lg h-9 px-4 text-[9px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" /> New Tier
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col hover:border-primary/40 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <Badge className={cn(
                  "bg-muted text-muted-foreground border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5",
                  plan.name === 'enterprise' && "bg-primary/10 text-primary"
                )}>
                  ID: {plan.id}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleEdit(plan)}>
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:text-destructive" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-0.5">{plan.name}</h3>
                <div className="text-lg font-black tracking-tighter text-primary">
                  {plan.price === 0 ? 'FREE' : formatPrice(plan.price)}
                  {plan.price > 0 && <span className="text-[8px] text-muted-foreground ml-1 uppercase">/ mo</span>}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 py-1.5 border-y border-border/30">
                   <Activity className="w-3 h-3 text-primary shrink-0" />
                   <span className="text-[9px] font-black uppercase tracking-wider text-foreground/80">
                      {plan.maxRequestsDay.toLocaleString()} Hits/Day
                   </span>
                </div>
                <div className="pt-1 space-y-1.5">
                  {Array.isArray(plan.features) && plan.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0 opacity-70" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">{feature}</span>
                    </div>
                  ))}
                  {plan.features?.length > 4 && (
                    <p className="text-[8px] font-black text-muted-foreground/50 uppercase ml-4">+{plan.features.length - 4} more</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/30">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => handleEdit(plan)}
                   className="w-full h-7 rounded-lg text-[8px] font-black uppercase tracking-widest border-border/50 hover:bg-muted"
                 >
                   Edit Plan
                 </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Compact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="text-xs font-black uppercase tracking-widest">{editingPlan ? 'Edit Plan' : 'New Plan'}</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                  <Input 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. PRO"
                    className="h-10 rounded-lg bg-muted/40 border-border/50 text-[10px] font-bold uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (IDR)</label>
                  <Input 
                    type="number"
                    required
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="h-10 rounded-lg bg-muted/40 border-border/50 text-[10px] font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Requests Limit</label>
                <Input 
                  type="number"
                  required
                  value={formData.maxRequestsDay} 
                  onChange={e => setFormData({...formData, maxRequestsDay: parseInt(e.target.value)})}
                  className="h-10 rounded-lg bg-muted/40 border-border/50 text-[10px] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Capabilities</label>
                <div className="flex gap-2">
                  <Input 
                    value={newFeature} 
                    onChange={e => setNewFeature(e.target.value)}
                    placeholder="Press enter to add..."
                    className="h-9 rounded-lg bg-muted/40 border-border/50 text-[9px] font-bold"
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline" className="h-9 px-3 rounded-lg shrink-0 text-[9px] font-black uppercase">Add</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features.map((f, i) => (
                    <Badge key={i} className="bg-primary/5 text-primary border border-primary/10 text-[8px] font-black uppercase tracking-widest py-1 px-2 flex gap-1.5 items-center">
                      {f} <X className="w-2.5 h-2.5 cursor-pointer hover:text-foreground" onClick={() => removeFeature(i)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
