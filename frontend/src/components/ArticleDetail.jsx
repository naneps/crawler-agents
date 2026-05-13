import { ArrowLeft, Globe, Calendar, ExternalLink, User, Clock, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ArticleDetail({ article, sourceName, onBack, loading }) {
  if (!article) return null;

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
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
              {sourceName}
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

        <div className="pt-10 space-y-6">
          <Separator className="opacity-50" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 h-14 rounded-xl text-xs font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              asChild
            >
              <a href={article.link} target="_blank" rel="noopener noreferrer">
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
