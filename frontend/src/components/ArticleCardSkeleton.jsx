import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function ArticleCardSkeleton({ idx = 0 }) {
  return (
    <Card
      className="overflow-hidden flex flex-col h-full border-border/50 bg-card/50 backdrop-blur-sm animate-fade-up"
      style={{ animationDelay: `${idx * 0.04}s` }}
    >
      {/* Thumbnail shimmer */}
      <div className="relative h-44 overflow-hidden shrink-0 bg-muted/40">
        <div className="absolute inset-0 skeleton-shimmer" />
        {/* Source badge shimmer */}
        <div className="absolute top-3 left-3 h-5 w-16 rounded-full bg-muted/60 overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1 space-y-2.5">
        {/* Title shimmer – two lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 rounded-md bg-muted/60 overflow-hidden w-full">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-3.5 rounded-md bg-muted/60 overflow-hidden w-4/5 relative">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
        {/* Description shimmer – two lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-2.5 rounded-md bg-muted/40 overflow-hidden w-full relative">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-2.5 rounded-md bg-muted/40 overflow-hidden w-3/4 relative">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <div className="h-3 w-20 rounded-md bg-muted/40 overflow-hidden relative">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <div className="h-7 w-16 rounded-md bg-muted/40 overflow-hidden relative">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </CardFooter>
    </Card>
  );
}
