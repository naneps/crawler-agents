import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, ArrowRight, CheckCircle, Zap, Globe, Code2,
  ExternalLink, ChevronRight, Radio, Plus, Mail, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar({ navigate }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-black text-sm tracking-tight">CrawlGen</span>
          <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0 hidden sm:inline-flex">
            API
          </Badge>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#sources" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
            Sources
          </a>
          <a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
            Pricing
          </a>
          <a href="/api-docs" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
            Docs
          </a>
          <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => navigate('/register')}>
            Get API Key <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ sourceCount, navigate }) {
  return (
    <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col items-start gap-6 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            Live · {sourceCount} sources active · Growing
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
          Indonesian News,
          <br />
          <span className="text-primary">as a REST API</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
          Access real-time articles from{' '}
          <span className="text-foreground font-semibold">{sourceCount}+ Indonesian news sources</span>{' '}
          — CNBC Indonesia, Antara, CNN Indonesia, and more.
          Sources keep growing; clients can also{' '}
          <span className="text-foreground font-semibold">request new ones</span>.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" className="gap-2 h-11" onClick={() => navigate('/register')}>
            Get Free API Key <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 h-11" asChild>
            <a href="/api-docs" target="_blank" rel="noopener">
              <BookOpen className="w-4 h-4" /> View Docs
            </a>
          </Button>
        </div>

        {/* Code snippet */}
        <div className="w-full mt-4 rounded-xl border border-border bg-card overflow-hidden text-sm">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              GET /api/news/cnbc/market
            </span>
          </div>
          <pre className="px-5 py-4 font-mono text-[12px] leading-6 overflow-x-auto">
            <span className="text-blue-400">fetch</span>
            {'('}
            <span className="text-emerald-400">"/api/news/cnbc/market"</span>
            {', {\n  headers: { '}
            <span className="text-yellow-400">"x-api-key"</span>
            {': '}
            <span className="text-emerald-400">"cg_your_key_here"</span>
            {' }\n})\n.then(r => r.json())\n.then(data => '}
            <span className="text-blue-400">console</span>
            {'.log(data.posts)); '}
            <span className="text-muted-foreground">// [{'{'}title, link, date, ...{'}'}]</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

function StatsBar({ sourceCount, loading }) {
  const stats = [
    { value: loading ? '...' : `${sourceCount}+`, label: 'News Sources' },
    { value: '50k+', label: 'Articles / day' },
    { value: '4', label: 'API Endpoints' },
    { value: '<300ms', label: 'Avg Response' },
  ];
  return (
    <div className="border-y border-border bg-muted/20 py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label}>
            <div className="text-2xl font-black text-primary font-mono">{s.value}</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesSection({ sources, loading }) {
  return (
    <section id="sources" className="py-16 px-6 max-w-6xl mx-auto">
      <div className="mb-3">
        <span className="font-mono text-[11px] text-primary uppercase tracking-widest">// sources</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
        Growing Collection of Sources
      </h2>
      <p className="text-muted-foreground text-sm mb-2 max-w-xl">
        We continuously add new sources. Missing one?{' '}
        <a href="mailto:hello@crawlgen.id" className="text-primary underline underline-offset-2">
          Request it
        </a>{' '}
        — if it's feasible, we'll add it.
      </p>

      <div className="flex items-center gap-2 mb-8">
        <Badge variant="outline" className="text-[10px] font-mono gap-1.5">
          <Plus className="w-2.5 h-2.5" /> Client requests accepted
        </Badge>
        <Badge variant="outline" className="text-[10px] font-mono gap-1.5">
          <Zap className="w-2.5 h-2.5" /> Actively growing
        </Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : sources.length === 0 ? (
        <p className="text-muted-foreground text-sm">No sources configured yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sources.map(src => (
            <Card key={src.id} className="hover:border-primary/50 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{src.name}</h3>
                  {src.baseUrl && (
                    <a
                      href={src.baseUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mb-3 truncate">
                  {(src.baseUrl || '').replace(/^https?:\/\//, '')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(src.categories || []).slice(0, 4).map(cat => (
                    <Badge key={cat} variant="secondary" className="text-[9px] font-mono px-1.5 py-0">
                      {cat}
                    </Badge>
                  ))}
                  {(src.categories || []).length > 4 && (
                    <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0">
                      +{src.categories.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function SampleArticles({ articles, loading }) {
  if (!loading && articles.length === 0) return null;
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="mb-3">
        <span className="font-mono text-[11px] text-primary uppercase tracking-widest">// live data</span>
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-2">Latest Articles, Right Now</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xl">
        Fetched live from the crawlers — exactly what your users will get via the API.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a, i) => (
            <Card key={i} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-[9px] font-mono">{a.sourceName}</Badge>
                  {a.date && (
                    <span className="text-[10px] text-muted-foreground font-mono">{a.date}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">{a.title}</h3>
                {(a.description || a.summary) && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {a.description || a.summary}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function PricingSection({ navigate }) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      per: '/mo',
      quota: '500 req / day',
      features: ['All sources', '4 API endpoints', 'JSON responses', 'API key management'],
      disabled: ['Priority support', 'SLA guarantee'],
      cta: 'Get Started Free',
      action: () => navigate('/register'),
      variant: 'outline',
    },
    {
      name: 'Pro',
      price: '$29',
      per: '/mo',
      quota: '50,000 req / day',
      features: ['All sources', '4 API endpoints', 'JSON responses', 'Multi API keys', 'Usage analytics', 'Email support'],
      disabled: [],
      cta: 'Contact Us',
      action: () => window.location.href = 'mailto:hello@crawlgen.id',
      variant: 'default',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      per: '',
      quota: 'Unlimited requests',
      features: ['Everything in Pro', 'Dedicated crawler', 'Custom sources', 'Webhook support', '99.9% SLA', 'Dedicated Slack'],
      disabled: [],
      cta: 'Contact Sales',
      action: () => window.location.href = 'mailto:hello@crawlgen.id',
      variant: 'outline',
    },
  ];

  return (
    <section id="pricing" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="mb-3">
        <span className="font-mono text-[11px] text-primary uppercase tracking-widest">// pricing</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Simple, Transparent Pricing</h2>
      <p className="text-muted-foreground text-sm mb-10">Start free. Upgrade when you need more.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={cn(
              'relative transition-all',
              plan.featured && 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20'
            )}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-[10px] font-mono font-bold px-3 py-0.5 shadow-sm">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="font-black text-lg">{plan.name}</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-primary font-mono">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.per}</span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground bg-muted rounded-md px-3 py-1.5 mt-2">
                {plan.quota}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.disabled.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/40">
                    <span className="w-3.5 h-3.5 mt-0.5 shrink-0 text-center leading-none">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.variant}
                className="w-full mt-2"
                onClick={plan.action}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function RegisterCTA({ navigate }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const r = await axios.post('/api/public/register', form);
      if (r.data.success) {
        setMsg({ type: 'success', text: '✓ Account created! Logging you in...' });
        const lr = await axios.post('/api/auth/login', form);
        if (lr.data.success) {
          window.location.href = '/keys';
          return;
        }
      } else {
        setMsg({ type: 'error', text: r.data.message || 'Registration failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="mb-3">
            <span className="font-mono text-[11px] text-primary uppercase tracking-widest">// get started</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
            Get Your Free API Key
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Free account. No credit card. Your API key is ready the moment you register.
          </p>
          <ul className="space-y-3">
            {[
              'Access all available sources immediately',
              '500 requests per day on the free plan',
              'Upgrade anytime as you scale',
              'Request new sources — we\'ll review and add if feasible',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-black text-base mb-5">Create Account</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">
                  Username
                </label>
                <Input
                  required
                  placeholder="yourname"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="h-10"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">
                  Password
                </label>
                <Input
                  required
                  type="password"
                  placeholder="min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="h-10"
                />
              </div>

              {msg && (
                <div className={cn(
                  'text-xs rounded-lg px-3 py-2.5 border',
                  msg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                )}>
                  {msg.text}
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <>Create Account &amp; Get Key <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary underline underline-offset-2"
                >
                  Login
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Radio className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-black text-sm">CrawlGen</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="/api-docs" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            API Docs
          </a>
          <a href="mailto:hello@crawlgen.id" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
          <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
        </div>
        <p className="text-xs text-muted-foreground font-mono">© 2026 CrawlGen. Built in Indonesia.</p>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/public/sources')
      .then(r => {
        if (r.data.success) setSources(r.data.sources || []);
      })
      .catch(() => {})
      .finally(() => setSourcesLoading(false));

    axios.get('/api/public/sample')
      .then(r => {
        if (r.data.success) setArticles(r.data.articles || []);
      })
      .catch(() => {})
      .finally(() => setArticlesLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar navigate={navigate} />
      <HeroSection sourceCount={sourcesLoading ? '...' : sources.length} navigate={navigate} />
      <StatsBar sourceCount={sources.length} loading={sourcesLoading} />
      <SourcesSection sources={sources} loading={sourcesLoading} />
      <SampleArticles articles={articles} loading={articlesLoading} />
      <PricingSection navigate={navigate} />
      <RegisterCTA navigate={navigate} />
      <Footer />
    </div>
  );
}
