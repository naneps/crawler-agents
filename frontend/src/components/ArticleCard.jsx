import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ArticleCard({ article, sourceName, onClick, idx }) {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full animate-fade-up border-border/50 bg-card/50 backdrop-blur-sm" 
      style={{ animationDelay: `${idx * 0.05}s` }} 
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        <img 
          src={article.thumbnail || 'https://images.unsplash.com/photo-1585829365234-781fdec3d4e3?w=800'} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        <Badge variant="secondary" className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-[9px] font-black uppercase tracking-wider border-none">
          {sourceName}
        </Badge>
      </div>
      <CardContent className="p-4 flex flex-col flex-1 space-y-2.5">
        <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors text-foreground line-clamp-2 tracking-tight">
          {article.title}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-80">
          {article.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          <Clock className="w-3 h-3" /> 
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-[9px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground">
          Explore
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}


