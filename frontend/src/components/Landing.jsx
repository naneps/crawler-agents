import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ArrowRight, CheckCircle, Zap, Globe, Code2,
  ExternalLink, ChevronRight, Radio, Plus, Mail, BookOpen,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar({ user }) {
  const navigate = useNavigate();
  const scrollToAuth = () => {
    if (user) {
      navigate('/feed');
    } else {
      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <Button size="sm" className="text-xs h-8 gap-1.5" onClick={scrollToAuth}>
            {user ? 'Go to Dashboard' : 'Sign In / Register'} <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ sourceCount, user }) {
  const navigate = useNavigate();
  const scrollToAuth = () => {
    if (user) {
      navigate('/feed');
    } else {
      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-40" />

      <div className="flex flex-col items-start gap-6 max-w-3xl relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-emerald-500/80 uppercase tracking-wider font-bold">
            Live · {sourceCount} sources active · Growing
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          Indonesian News,
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">as a REST API</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
          Access real-time articles from{' '}
          <span className="text-foreground font-bold">{sourceCount}+ Indonesian news sources</span>{' '}
          like CNBC, Antara, and CNN. Integrate world-class intelligence directly into your app in minutes.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" className="gap-2 h-12 px-8 shadow-lg shadow-primary/20 text-sm font-bold" onClick={scrollToAuth}>
            {user ? 'Go to Dashboard' : 'Get Free API Key'} <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-sm font-bold bg-background/50 backdrop-blur-sm" asChild>
            <a href="/api-docs" target="_blank" rel="noopener">
              <BookOpen className="w-4 h-4" /> View Documentation
            </a>
          </Button>
        </div>

        {/* Code snippet */}
        <div className="w-full mt-8 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden text-sm group">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/30">
            <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-inner"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-inner"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-inner"></span>
            <span className="ml-3 font-mono text-[11px] text-muted-foreground tracking-widest uppercase">
              curl -X GET /api/news/cnbc/market
            </span>
          </div>
          <pre className="px-6 py-5 font-mono text-[13px] leading-relaxed overflow-x-auto text-foreground/80">
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
            <span className="text-muted-foreground transition-opacity group-hover:opacity-100 opacity-60">// Output: [{'{'}title, link, excerpt...{'}'}]</span>
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
    <div className="border-y border-border bg-gradient-to-r from-muted/10 via-muted/30 to-muted/10 py-10 px-6 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="text-3xl font-black text-foreground font-mono mb-2">{s.value}</div>
            <div className="text-[11px] text-primary uppercase tracking-[0.2em] font-bold">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesSection({ sources, loading }) {
  return (
    <section id="sources" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] text-primary uppercase tracking-[0.2em] font-bold block mb-3">// sources</span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
          A Growing Intelligence Network
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          We continuously add new sources to our crawler cluster. Missing one? Request it and we'll integrate it for you.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse border border-border" />
          ))}
        </div>
      ) : sources.length === 0 ? (
        <p className="text-muted-foreground text-center">No sources configured yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sources.map(src => (
            <Card key={src.id} className="hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-sm leading-tight text-foreground/90 group-hover:text-primary transition-colors">{src.name}</h3>
                  {src.baseUrl && (
                    <a
                      href={src.baseUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/70 mb-4 truncate">
                  {(src.baseUrl || '').replace(/^https?:\/\//, '')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(src.categories || []).slice(0, 3).map(cat => (
                    <Badge key={cat} variant="secondary" className="text-[9px] font-mono px-2 py-0.5 bg-muted/50 text-muted-foreground hover:text-foreground">
                      {cat}
                    </Badge>
                  ))}
                  {(src.categories || []).length > 3 && (
                    <Badge variant="outline" className="text-[9px] font-mono px-2 py-0.5 border-border/50 text-muted-foreground">
                      +{src.categories.length - 3}
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

function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      per: '/mo',
      quota: '500 req / day',
      features: ['All sources', '4 API endpoints', 'JSON responses', 'API key management'],
      disabled: ['Priority support', 'SLA guarantee'],
      variant: 'outline',
    },
    {
      name: 'Pro',
      price: '$29',
      per: '/mo',
      quota: '50,000 req / day',
      features: ['All sources', '4 API endpoints', 'JSON responses', 'Multi API keys', 'Usage analytics', 'Email support'],
      disabled: [],
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
      variant: 'outline',
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto border-t border-border/50 bg-muted/10">
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] text-primary uppercase tracking-[0.2em] font-bold block mb-3">// pricing</span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Transparent Scaling</h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">Start free and upgrade your limits seamlessly as your app's traffic grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={cn(
              'relative transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm',
              plan.featured ? 'border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-105 z-10' : 'hover:border-primary/30'
            )}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-[10px] font-mono font-bold px-4 py-1 shadow-md bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-6 pt-8 px-8 text-center">
              <div className="font-black text-xl mb-2">{plan.name}</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm font-medium">{plan.per}</span>
              </div>
              <div className="font-mono text-[11px] text-primary/80 bg-primary/10 rounded-full px-4 py-1.5 mt-4 inline-block font-bold">
                {plan.quota}
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.disabled.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/40 font-medium">
                    <span className="w-4 h-4 mt-0.5 shrink-0 text-center leading-none">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AuthSection({ user }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  if (user) {
    return (
      <section id="auth-section" className="py-24 px-6 max-w-6xl mx-auto border-t border-border/50 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
           <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10 text-primary" />
           </div>
           <h2 className="text-3xl font-black tracking-tight">You are already Authenticated</h2>
           <p className="text-muted-foreground">Welcome back, <span className="text-foreground font-bold">{user.username}</span>. Your neural link is active and secure.</p>
           <Button size="lg" className="h-14 px-10 gap-2 font-bold" onClick={() => navigate('/feed')}>
              Enter Dashboard <ArrowRight className="w-4 h-4" />
           </Button>
        </div>
      </section>
    );
  }

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/keys`
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <section id="auth-section" className="py-24 px-6 max-w-6xl mx-auto border-t border-border/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-mono text-[11px] text-primary uppercase tracking-[0.2em] font-bold block mb-4">// get started</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
            Deploy in <span className="text-primary">Seconds</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Create a free account to instantly generate your API key. No credit card required. Connect via your preferred provider.
          </p>
          <ul className="space-y-4">
            {[
              'Instant API Key Generation',
              'Access to all premium data sources',
              'Seamless integration with any stack',
              'Generous 500 requests/day free tier',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-base text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          {/* Card Decor */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />
          
          <CardContent className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3 mb-6">
                <Radio className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-black text-2xl mb-2">Access Neural Link</h3>
              <p className="text-muted-foreground text-sm font-medium">Authenticate to provision your API credentials.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full h-14 text-sm font-bold gap-3 border-border bg-background hover:bg-muted/50 hover:text-foreground transition-all"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
              >
                {/* Github SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Continue with GitHub
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full h-14 text-sm font-bold gap-3 border-border bg-background hover:bg-muted/50 hover:text-foreground transition-all"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
              >
                {/* Google SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground font-medium mt-8 leading-relaxed">
              By authenticating, you agree to our Terms of Service and Privacy Policy. <br className="hidden sm:block"/> Access is granted instantly upon verification.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6 bg-muted/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <span className="font-black text-base tracking-tight">CrawlGen</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <a href="/api-docs" target="_blank" rel="noopener" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="mailto:hello@crawlgen.id" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact Support
          </a>
          <a href="/keys" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground font-mono font-bold">
          © 2026 CrawlGen Intelligence.
        </p>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing({ user }) {
  const [sources, setSources] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);

  useEffect(() => {
    // Only fetch sources to showcase
    axios.get('/api/public/sources')
      .then(r => {
        if (r.data.success) setSources(r.data.sources || []);
      })
      .catch(() => {})
      .finally(() => setSourcesLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar user={user} />
      <HeroSection sourceCount={sourcesLoading ? '...' : sources.length} user={user} />
      <StatsBar sourceCount={sources.length} loading={sourcesLoading} />
      <SourcesSection sources={sources} loading={sourcesLoading} />
      <PricingSection />
      <AuthSection user={user} />
      <Footer />
    </div>
  );
}

