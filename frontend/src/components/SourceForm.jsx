import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Globe, Database, Code, 
  HelpCircle, Plus, Trash2, Activity, Zap
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function KeyValueInput({ title, data, onChange, placeholder, description, icon: Icon }) {
  const entries = Object.entries(data || {});
  
  const updateKey = (oldKey, newKey) => {
    const newData = { ...data };
    const value = newData[oldKey];
    delete newData[oldKey];
    newData[newKey] = value;
    onChange(newData);
  };

  const updateValue = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const removeEntry = (key) => {
    const newData = { ...data };
    delete newData[key];
    onChange(newData);
  };

  const addEntry = () => {
    onChange({ ...data, '': '' });
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {title}
            </CardTitle>
            <CardDescription className="text-[10px] font-medium tracking-normal">{description}</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addEntry}
            className="h-7 text-[9px] font-black uppercase tracking-widest gap-1.5"
          >
            <Plus className="w-3 h-3" /> New Rule
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-0 space-y-2">
        {entries.length === 0 && (
          <div className="py-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-muted/20">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No mapping defined</p>
          </div>
        )}
        {entries.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 group animate-in slide-in-from-left-2 duration-200">
            <Input 
              placeholder={placeholder.key}
              value={key}
              onChange={(e) => updateKey(key, e.target.value)}
              className="h-10 text-[11px] font-bold bg-background/50 flex-1"
            />
            <Input 
              placeholder={placeholder.value}
              value={value}
              onChange={(e) => updateValue(key, e.target.value)}
              className="h-10 text-[11px] font-medium bg-background/50 flex-[2]"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => removeEntry(key)}
              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SourceEditorForm({ onSave, sourcesList }) {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    baseUrl: '',
    categories: {},
    selectors: {}
  });

  useEffect(() => {
    if (editId) {
      const existing = sourcesList.find(s => s.id === editId);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [editId, sourcesList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      navigate('/sources');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost"
            onClick={() => navigate('/sources')}
            className="group gap-3 px-0 hover:bg-transparent"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Back to</p>
              <p className="text-[11px] font-black uppercase tracking-tight">Intelligence Repository</p>
            </div>
          </Button>

          <Badge variant="secondary" className="px-3 py-1 text-[9px] font-black uppercase tracking-widest gap-2">
            <Activity className={cn("w-3 h-3", editId ? "text-primary" : "text-emerald-500")} />
            {editId ? `Editing Node: ${editId}` : 'New Stream Provisioning'}
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-foreground">Core Parameters</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Identify and address the neural node</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Node Identifier</label>
                  <Input 
                    required
                    disabled={!!editId}
                    value={formData.id} 
                    onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="e.g. reuters-world"
                    className="h-11 font-mono text-[11px] bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Label</label>
                  <Input 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Reuters World Intelligence"
                    className="h-11 font-black text-[11px] bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Neural Root (Base URL)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    required
                    value={formData.baseUrl} 
                    onChange={e => setFormData({...formData, baseUrl: e.target.value})}
                    placeholder="https://www.reuters.com"
                    className="h-11 pl-9 font-mono text-[11px] bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
              </div>
            </section>

            <Separator className="opacity-50" />

            <KeyValueInput 
              title="Category Streams"
              description="Map neural sub-directories to intelligence classifications"
              icon={Zap}
              data={formData.categories}
              onChange={(val) => setFormData({...formData, categories: val})}
              placeholder={{ key: 'Category: tech', value: 'Path: /technology' }}
            />

            <Separator className="opacity-50" />

            <KeyValueInput 
              title="Extraction Selectors"
              description="CSS selectors for automated intelligence harvesting"
              icon={Code}
              data={formData.selectors}
              onChange={(val) => setFormData({...formData, selectors: val})}
              placeholder={{ key: 'Field: headline', value: 'CSS: .article-title' }}
            />
          </div>

          <div className="space-y-6">
            <Card className="bg-foreground text-background border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl -mr-12 -mt-12" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Intelligence Guard
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">DOM Extraction</p>
                  <p className="text-[11px] font-medium leading-relaxed">Ensure selectors are unique to avoid noise in the stream.</p>
                </div>
                <div className="p-3 rounded-lg bg-background/5 border border-white/10">
                  <code className="text-[9px] font-mono opacity-80 block">Example: article h1::text</code>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-xl text-[11px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Commit Intelligence Sync
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ScrollArea>
  );
}
