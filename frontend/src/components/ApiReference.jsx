import React from 'react';
import { Terminal, Lock, Globe, Cpu, Copy, Check, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const endpoints = [
  {
    group: 'Authentication',
    items: [
      { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user and start session', auth: false },
      { method: 'GET', path: '/api/auth/me', desc: 'Get current session profile', auth: true },
    ]
  },
  {
    group: 'Discovery',
    items: [
      { method: 'GET', path: '/api/sources', desc: 'List all news sources and categories', auth: true },
      { method: 'GET', path: '/api/news/:source/categories', desc: 'Get specific categories for a source', auth: true },
    ]
  },
  {
    group: 'News Engine',
    items: [
      { 
        method: 'GET', 
        path: '/api/news/:source', 
        desc: 'Fetch latest articles from a source', 
        auth: true,
        example: {
          curl: 'curl -X GET "http://localhost:3000/api/news/antara" \\\n  -H "x-api-key: YOUR_API_KEY"',
          js: 'fetch("http://localhost:3000/api/news/antara", {\n  headers: { "x-api-key": "YOUR_API_KEY" }\n})\n.then(res => res.json())\n.then(data => console.log(data));'
        }
      },
      { 
        method: 'GET', 
        path: '/api/news/:source/:category', 
        desc: 'Fetch filtered stream by category', 
        auth: true,
        example: {
          curl: 'curl -X GET "http://localhost:3000/api/news/antara/ekonomi" \\\n  -H "x-api-key: YOUR_API_KEY"',
          js: 'const res = await fetch("http://localhost:3000/api/news/antara/ekonomi", {\n  headers: { "x-api-key": "YOUR_API_KEY" }\n});\nconst data = await res.json();'
        }
      },
      { method: 'GET', path: '/api/news/:source/detail?url=...', desc: 'Scrape full content for a specific URL', auth: true },
    ]
  },
  {
    group: 'System Management',
    items: [
      { method: 'POST', path: '/api/sources', desc: 'Upsert crawler configuration', auth: 'admin' },
      { method: 'DELETE', path: '/api/sources/:id', desc: 'Decommission a crawler', auth: 'admin' },
    ]
  }
];

export default function ApiReference() {
  const [copied, setCopied] = React.useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const downloadCollection = () => {
    const origin = window.location.origin || "http://localhost:3000";
    const collection = {
      info: {
        _postman_id: "c62fb4bf-4ad4-4d8b-967a-59b4317f29f0",
        name: "CrawlGen API Collection",
        description: "API collection for CrawlGen News Aggregator (compatible with Postman and Bruno)",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [
        {
          name: "Authentication",
          item: [
            {
              name: "Login",
              request: {
                method: "POST",
                header: [
                  {
                    key: "Content-Type",
                    value: "application/json"
                  }
                ],
                body: {
                  mode: "raw",
                  raw: JSON.stringify({ username: "admin@admin.com", password: "password123" }, null, 2)
                },
                url: {
                  raw: "{{baseUrl}}/api/auth/login",
                  host: ["{{baseUrl}}"],
                  path: ["api", "auth", "login"]
                }
              }
            },
            {
              name: "Get Current User",
              request: {
                method: "GET",
                header: [
                  {
                    key: "Authorization",
                    value: "Bearer {{sessionToken}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/auth/me",
                  host: ["{{baseUrl}}"],
                  path: ["api", "auth", "me"]
                }
              }
            }
          ]
        },
        {
          name: "Discovery",
          item: [
            {
              name: "List Sources",
              request: {
                method: "GET",
                header: [
                  {
                    key: "x-api-key",
                    value: "{{apiKey}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/sources",
                  host: ["{{baseUrl}}"],
                  path: ["api", "sources"]
                }
              }
            },
            {
              name: "Get Source Categories",
              request: {
                method: "GET",
                header: [
                  {
                    key: "x-api-key",
                    value: "{{apiKey}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/news/:source/categories",
                  host: ["{{baseUrl}}"],
                  path: ["api", "news", ":source", "categories"],
                  variable: [
                    {
                      key: "source",
                      value: "cnbc"
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          name: "News Feed",
          item: [
            {
              name: "Get Latest News",
              request: {
                method: "GET",
                header: [
                  {
                    key: "x-api-key",
                    value: "{{apiKey}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/news/:source?fetchDetail=false",
                  host: ["{{baseUrl}}"],
                  path: ["api", "news", ":source"],
                  query: [
                    {
                      key: "fetchDetail",
                      value: "false"
                    }
                  ],
                  variable: [
                    {
                      key: "source",
                      value: "cnbc"
                    }
                  ]
                }
              }
            },
            {
              name: "Get News by Category",
              request: {
                method: "GET",
                header: [
                  {
                    key: "x-api-key",
                    value: "{{apiKey}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/news/:source/:category?fetchDetail=false",
                  host: ["{{baseUrl}}"],
                  path: ["api", "news", ":source", ":category"],
                  query: [
                    {
                      key: "fetchDetail",
                      value: "false"
                    }
                  ],
                  variable: [
                    {
                      key: "source",
                      value: "cnbc"
                    },
                    {
                      key: "category",
                      value: "news"
                    }
                  ]
                }
              }
            },
            {
              name: "Get Article Detail",
              request: {
                method: "GET",
                header: [
                  {
                    key: "x-api-key",
                    value: "{{apiKey}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/news/:source/detail?url=https://example.com/article",
                  host: ["{{baseUrl}}"],
                  path: ["api", "news", ":source", "detail"],
                  query: [
                    {
                      key: "url",
                      value: "https://example.com/article"
                    }
                  ],
                  variable: [
                    {
                      key: "source",
                      value: "cnbc"
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          name: "API Keys",
          item: [
            {
              name: "Get Quota & Usage",
              request: {
                method: "GET",
                header: [
                  {
                    key: "Authorization",
                    value: "Bearer {{sessionToken}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/user/quota",
                  host: ["{{baseUrl}}"],
                  path: ["api", "user", "quota"]
                }
              }
            },
            {
              name: "List API Keys",
              request: {
                method: "GET",
                header: [
                  {
                    key: "Authorization",
                    value: "Bearer {{sessionToken}}"
                  }
                ],
                url: {
                  raw: "{{baseUrl}}/api/user/keys",
                  host: ["{{baseUrl}}"],
                  path: ["api", "user", "keys"]
                }
              }
            },
            {
              name: "Create API Key",
              request: {
                method: "POST",
                header: [
                  {
                    key: "Authorization",
                    value: "Bearer {{sessionToken}}"
                  },
                  {
                    key: "Content-Type",
                    value: "application/json"
                  }
                ],
                body: {
                  mode: "raw",
                  raw: JSON.stringify({ name: "Production Key" }, null, 2)
                },
                url: {
                  raw: "{{baseUrl}}/api/user/keys",
                  host: ["{{baseUrl}}"],
                  path: ["api", "user", "keys"]
                }
              }
            }
          ]
        }
      ],
      variable: [
        {
          key: "baseUrl",
          value: origin,
          type: "string"
        },
        {
          key: "apiKey",
          value: "your-api-key-here",
          type: "string"
        },
        {
          key: "sessionToken",
          value: "your-jwt-session-token",
          type: "string"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CrawlGen_API_Collection.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="px-3 py-1 rounded-full bg-primary/10 border-none text-primary text-[10px] font-black uppercase tracking-widest gap-2">
              <Cpu className="w-3 h-3" /> API Documentation v3.0
            </Badge>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">API Reference</h1>
            <p className="text-muted-foreground font-medium max-w-xl text-sm leading-relaxed">
              Integrate CrawlGen Intelligence into your own applications via our programmatic REST interface.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <Button
              onClick={downloadCollection}
              className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" /> Download API Collection
            </Button>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-4 py-2.5 rounded-xl border border-border/50 h-10">
              Base URL: <code className="text-foreground ml-1">{window.location.origin || "http://localhost:3000"}</code>
            </div>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <CardHeader>
              <Lock className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg font-black uppercase tracking-tight">Authentication</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                Header-based security protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Requests must include an <code className="text-foreground font-black">x-api-key</code> header with a valid credential.
              </p>
              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg font-mono text-[11px] text-muted-foreground">
                x-api-key: <span className="text-primary font-bold">YOUR_SECRET_KEY</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            <CardHeader>
              <Globe className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg font-black uppercase tracking-tight">Content Types</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                Data exchange standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                The platform consumes and responds exclusively with JSON payloads.
              </p>
              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg font-mono text-[11px] text-muted-foreground">
                Content-Type: <span className="text-foreground">application/json</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints */}
        <div className="space-y-12 pb-10">
          {endpoints.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{group.group}</h2>
                <Separator className="flex-1 opacity-50" />
              </div>
              
              <div className="grid gap-3">
                {group.items.map((item, iIdx) => (
                  <Card 
                    key={iIdx} 
                    className="border-border/50 bg-card/30 hover:bg-muted/30 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-center gap-4 shrink-0">
                        <Badge className={cn(
                          "min-w-[64px] justify-center h-7 text-[10px] font-black uppercase tracking-widest border-none",
                          item.method === 'GET' ? "bg-emerald-500/10 text-emerald-500" : 
                          item.method === 'POST' ? "bg-blue-500/10 text-blue-500" : 
                          "bg-red-500/10 text-red-500"
                        )}>
                          {item.method}
                        </Badge>
                        <div className="flex items-center gap-2 group/code">
                          <code className="text-[11px] font-mono font-bold text-foreground bg-muted/50 px-2.5 py-1 rounded border border-border/50">
                            {item.path}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopy(item.path)}
                            className="h-7 w-7 hover:bg-muted rounded-md text-muted-foreground opacity-0 group-hover/code:opacity-100 transition-all"
                          >
                            {copied === item.path ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {item.auth && (
                          <Badge variant="outline" className={cn(
                            "h-6 text-[9px] font-black uppercase tracking-widest gap-1.5 border-none",
                            item.auth === 'admin' ? "bg-amber-500/10 text-amber-500" : "bg-primary/5 text-primary"
                          )}>
                            <Lock className="w-3 h-3" /> {item.auth === 'admin' ? 'Admin' : 'Key'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {item.example && (
                      <div className="px-4 pb-4">
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/5">
                          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="flex gap-4">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Implementation Example</span>
                            </div>
                            <div className="flex gap-3">
                               <button onClick={() => handleCopy(item.example.curl)} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">cURL</button>
                               <button onClick={() => handleCopy(item.example.js)} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">JavaScript</button>
                            </div>
                          </div>
                          <div className="p-4 overflow-x-auto">
                            <pre className="text-[10px] font-mono text-slate-300 leading-relaxed">
                              {item.example.curl}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-border/50 text-center">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-50">End of Reference • Optimized for CrawlGen OS</p>
        </div>
      </div>
    </ScrollArea>
  );
}
