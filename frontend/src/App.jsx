import axios from 'axios';
import {
  Activity,
  AlertCircle,
  Menu,
  Plus,
  Search,
  RefreshCw,
  Layers,
  LayoutDashboard,
  Database,
  Terminal,
  ShieldCheck,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import Sidebar from './components/Sidebar';
import SourceEditorForm from './components/SourceForm';
import SourcesInventory from './components/SourcesInventory';
import Auth from './components/Auth';
import ApiReference from './components/ApiReference';
import KeyManager from './components/KeyManager';
import PlatformDashboard from './components/PlatformDashboard';
import Landing from './components/Landing';

function Dialog({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 rounded-2xl overflow-hidden">
        <div className="p-8 text-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
            type === 'danger' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wider">{message}</p>
          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              variant={type === 'danger' ? 'destructive' : 'default'}
              onClick={onConfirm}
              className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [sources, setSources] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false });
  const [theme, setTheme] = useState(() => localStorage.getItem('crawlgen-theme') || 'dark');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const activeTab = useMemo(() => {
    if (location.pathname.startsWith('/feed')) return 'feed';
    if (location.pathname.startsWith('/sources')) return 'sources';
    if (location.pathname.startsWith('/docs')) return 'docs';
    if (location.pathname.startsWith('/keys')) return 'keys';
    if (location.pathname.startsWith('/admin/dashboard')) return 'dashboard';
    return 'feed';
  }, [location.pathname]);

  const currentSource = useMemo(() => {
    const parts = location.pathname.split('/');
    const idFromUrl = parts[1] === 'feed' && parts[2] ? parts[2] : null;
    
    // If ID from URL exists and is valid, use it
    if (idFromUrl && sources[idFromUrl]) return idFromUrl;
    
    // Otherwise fallback to first source
    return Object.keys(sources)[0] || '';
  }, [location.pathname, sources]);

  const currentCategory = useMemo(() => {
    const parts = location.pathname.split('/');
    if (parts[1] === 'feed' && parts[3]) return parts[3];
    
    const sourceData = sources[currentSource];
    if (sourceData && sourceData.categories) {
      const cats = Object.keys(sourceData.categories);
      return cats[0] || '';
    }
    return '';
  }, [location.pathname, currentSource, sources]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('crawlgen-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('crawlgen-theme', theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchSources();
  }, [user]);

  useEffect(() => {
    if (user && currentSource) fetchArticles();
  }, [user, currentSource, currentCategory]);

  useEffect(() => {
    setSelectedArticle(null);
  }, [location.pathname]);

  const checkAuth = async (redirectTo) => {
    try {
      const res = await axios.get('/api/auth/me');
      console.log('🔐 Auth Check:', res.data);
      if (res.data.loggedIn) {
        setUser({
          username: res.data.username,
          role: res.data.role || 'user',
          apiKey: res.data.apiKey || res.data.api_key || '' 
        });
        if (redirectTo) navigate(redirectTo);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get('/api/sources');
      // Convert array to object with ID as key for easier lookup
      const sourcesObj = res.data.reduce((acc, src) => {
        acc[src.id] = src;
        return acc;
      }, {});
      setSources(sourcesObj);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchArticles = async () => {
    if (!currentSource) return;
    try {
      const url = currentCategory 
        ? `/api/news/${currentSource}/${currentCategory}`
        : `/api/news/${currentSource}`;
      const res = await axios.get(url);
      // Handle potential nested data structure from backend
      const data = res.data.data?.posts || res.data.posts || (Array.isArray(res.data) ? res.data : []);
      setArticles(data);
    } catch (e) {
      console.error(e);
      setArticles([]);
    }
  };

  const fetchArticleDetail = async (article) => {
    setSelectedArticle(article);
    setDetailLoading(true);
    try {
      const res = await axios.get(`/api/news/${currentSource}/detail?url=${encodeURIComponent(article.link)}`);
      if (res.data.success) {
        setSelectedArticle({ ...article, contentHtml: res.data.data.contentHtml });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    navigate('/');
  };

  const saveSource = async (formData) => {
    const res = await axios.post('/api/sources', formData);
    if (res.data.success) fetchSources();
    return res.data;
  };

  const deleteSource = async (id) => {
    setDialog({
      isOpen: true,
      title: 'Decommission Source',
      message: `Are you sure you want to permanently remove intelligence source "${id}"? This action cannot be undone.`,
      onConfirm: async () => {
        await axios.delete(`/api/sources/${id}`);
        fetchSources();
        setDialog({ isOpen: false });
      },
      onCancel: () => setDialog({ isOpen: false })
    });
  };

  const sourcesList = useMemo(() => Object.entries(sources).map(([id, s]) => ({ id, ...s })), [sources]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Neural Link...</p>
      </div>
    </div>
  );

  // Unauthenticated: show Landing at /, Auth at /login and /register
  if (!user) return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        <Auth
          onLogin={checkAuth}
          theme={theme}
          toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          defaultView="login"
        />
      } />
      <Route path="/register" element={
        <Auth
          onLogin={checkAuth}
          theme={theme}
          toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          defaultView="register"
        />
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        sources={sources} 
        currentSource={currentSource}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground transition-all duration-500 overflow-hidden relative">
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-8 min-w-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight line-clamp-1">
                  {activeTab === 'feed' ? (sources[currentSource]?.name || 'Neural Stream') : 
                   activeTab === 'sources' ? 'Source Management' : 
                   activeTab === 'keys' ? 'API Keys' : 
                   activeTab === 'dashboard' ? 'Platform Analytics' :
                   activeTab === 'docs' ? 'API Reference' : 'CrawlGen Intelligence'}
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    {activeTab === 'feed' ? 'Neural Stream Active' : 'System Node Secure'}
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'feed' && sources[currentSource]?.categories && (
              <Tabs value={currentCategory} className="hidden xl:block">
                <TabsList className="bg-muted/50 h-8 p-1">
                  {Object.keys(sources[currentSource].categories).map(cat => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      onClick={() => navigate(`/feed/${currentSource}/${cat}`)}
                      className="text-[9px] font-black uppercase tracking-widest px-3 h-6"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                type="text"
                placeholder="Search stream..."
                className="pl-9 h-8 text-[11px] font-medium w-48 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-8 w-8"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/feed/:id?/:cat?" element={
              selectedArticle ? (
                <ArticleDetail 
                  article={selectedArticle} 
                  sourceName={sources[currentSource]?.name}
                  onBack={() => setSelectedArticle(null)}
                  loading={detailLoading}
                />
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-6 md:p-8">
                    <div className="max-w-[1600px] mx-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {Array.isArray(articles) && articles.map((article, idx) => (
                          <ArticleCard 
                            key={idx} 
                            article={article} 
                            sourceName={sources[currentSource]?.name}
                            onClick={() => fetchArticleDetail(article)}
                            idx={idx}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )
            } />
            <Route path="/admin/dashboard" element={<PlatformDashboard />} />
            <Route path="/sources" element={
              <SourcesInventory 
                sourcesList={sourcesList} 
                onAdd={() => navigate('/sources/new')}
                onEdit={(src) => navigate(`/sources/edit/${src.id}`)}
                onDelete={deleteSource}
              />
            } />
            <Route path="/sources/new" element={<SourceEditorForm onSave={saveSource} sourcesList={sourcesList} />} />
            <Route path="/sources/edit/:id" element={<SourceEditorForm onSave={saveSource} sourcesList={sourcesList} />} />
            <Route path="/docs" element={<ApiReference />} />
            <Route path="/keys" element={<KeyManager />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </div>
      </main>

      <Dialog {...dialog} />
    </div>
  );
}
