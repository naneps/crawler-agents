import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  BarChart3, 
  Clock, 
  Activity, 
  Globe, 
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function KeyManager() {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await axios.get('/api/user/keys');
      setKeys(res.data.keys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName) return;
    try {
      await axios.post('/api/user/keys', { name: newKeyName });
      setNewKeyName('');
      fetchKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteKey = async (id) => {
    try {
      await axios.delete(`/api/user/keys/${id}`);
      fetchKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async (key) => {
    setSelectedKey(key);
    setLogsLoading(true);
    try {
      const res = await axios.get(`/api/user/keys/${key.id}/logs`);
      setLogs(res.data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <Activity className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-8 md:p-12 max-w-[1200px] mx-auto w-full space-y-12">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Nodes</p>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black tracking-tighter">{keys.length}</h4>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Intelligence Throughput</p>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black tracking-tighter">
                {keys.reduce((acc, k) => acc + (k.total_hits || 0), 0)}
              </h4>
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg Latency</p>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black tracking-tighter">
                {keys.length ? Math.round(keys.reduce((acc, k) => acc + (k.avg_latency || 0), 0) / keys.length) : 0}ms
              </h4>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-muted/30 p-6 rounded-2xl border border-border">
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-tight">Provision New API Key</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Create unique credentials for public endpoint integration.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input 
              placeholder="Key identifier (e.g. Production-App)" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="h-10 text-xs font-bold bg-background w-full md:w-64"
            />
            <Button onClick={createKey} className="h-10 px-6 text-[10px] font-black uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        {/* Keys List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest">API Key Registry</h3>
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{keys.length} Registered Keys</Badge>
          </div>

          {keys.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No active access keys detected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {keys.map((k) => (
                <div key={k.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/20 transition-all">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight truncate">{k.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{k.total_hits || 0} hits</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{k.error_count || 0} errors</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-xl border border-border/50">
                        <code className="text-[10px] font-mono font-bold text-primary tracking-tight">
                          {k.key_value.slice(0, 10)}••••••••••••••••••••
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleCopy(k.key_value, k.id)}
                        >
                          {copiedId === k.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteKey(k.id)}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Mini Stats Bar */}
                  <div className="px-6 py-3 bg-muted/20 border-t border-border/50 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex gap-4">
                      <span>Latency: {Math.round(k.avg_latency || 0)}ms</span>
                      <span>Created: {new Date(k.created_at).toLocaleDateString()}</span>
                    </div>
                    <div 
                      onClick={() => fetchLogs(k)}
                      className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
                    >
                      View Logs <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logs Modal Overlay */}
      {selectedKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-2xl h-full border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedKey(null)}
                  className="h-9 w-9 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Access Logs</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">{selectedKey.name}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest">Live Monitoring</Badge>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                {logsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Activity className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Intelligence Logs...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-20 space-y-4 border border-dashed border-border rounded-2xl">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No activity recorded for this node.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase",
                            log.status_code >= 400 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                          )}>
                            {log.status_code}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-foreground uppercase">{log.method}</span>
                              <code className="text-[10px] text-muted-foreground font-mono">{log.endpoint}</code>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                              <span>{log.ip_address}</span>
                              <Separator orientation="vertical" className="h-2" />
                              <span>{log.response_time}ms</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-muted-foreground uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                          <p className="text-[8px] text-muted-foreground/60 uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
