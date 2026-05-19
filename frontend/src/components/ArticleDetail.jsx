import { ArrowLeft, Globe, Calendar, ExternalLink, User, Clock, Share2, Link, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ArticleDetail({ article, sourceName, onBack, loading }) {
  if (!article) return null;

  const displaySourceName = article.sourceName || sourceName;
  const baseUrl = article.sourceBaseUrl;
  const articleUrl = article.articleUrl || article.link;

  return (
    <ScrollArea className="h-full bg-background animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="group gap-3 px-0 hover:bg-transparent"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Return to</p>
              <p className="text-[11px] font-black uppercase tracking-tight">Intelligence Stream</p>
            </div>
          </Button>

          <div className="flex items-center gap-2">
            {articleUrl && (
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg" asChild>
                <a href={articleUrl} target="_blank" rel="noopener noreferrer" title="Copy article URL">
                  <Share2 className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
              {displaySourceName}
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              <span>{Math.ceil((article.content?.length || 500) / 1000)} min read</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{new Date(article.pubDate).toLocaleString()}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground">{article.author}</span>
              </div>
            )}
          </div>

          {/* Source & URL info row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {baseUrl && (
              <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Globe className="w-3 h-3" />
                </div>
                <span className="truncate max-w-[200px]">{baseUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {articleUrl && (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <Link className="w-3 h-3" />
                </div>
                <span className="truncate max-w-xs opacity-70">{articleUrl}</span>
              </a>
            )}
          </div>
        </div>

        <Separator className="opacity-50" />

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
          <img 
            src={article.thumbnail || 'https://images.unsplash.com/photo-1585829365234-781fdec3d4e3?w=1200'} 
            className="w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>

        {loading && !article.content && !article.contentHtml ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-muted rounded-lg w-full" />
            <div className="h-4 bg-muted rounded-lg w-11/12" />
            <div className="h-4 bg-muted rounded-lg w-full" />
            <div className="h-4 bg-muted rounded-lg w-4/5" />
          </div>
        ) : (
          <article 
            className="prose prose-slate dark:prose-invert max-w-none prose-p:text-foreground/90 prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary font-medium text-lg" 
            dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content || article.description }} 
          />
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              <Tag className="w-3 h-3" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-background/50 border-border/50 hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 space-y-6">
          <Separator className="opacity-50" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 h-14 rounded-xl text-xs font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              asChild
            >
              <a href={articleUrl || article.link} target="_blank" rel="noopener noreferrer">
                Explore Full Intelligence
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button 
              variant="outline"
              onClick={onBack}
              className="px-10 h-14 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              Close Node
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
