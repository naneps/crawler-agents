import { Plus, Edit3, Trash2, Database, Globe, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SourcesInventory({ sourcesList, onAdd, onEdit, onDelete }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="p-6 md:p-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
              <Database className="w-5 h-5 text-primary" />
              Intelligence Repository
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider opacity-70">
              Manage global news aggregation nodes and extraction logic
            </p>
          </div>
          <Button 
            onClick={onAdd} 
            className="rounded-lg px-6 h-10 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add Neural Node
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Identity</TableHead>
                  <TableHead className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Identifier</TableHead>
                  <TableHead className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Root</TableHead>
                  <TableHead className="h-11 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourcesList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Database className="w-8 h-8" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No intelligence sources found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {sourcesList.map(src => (
                  <TableRow key={src.id} className="group hover:bg-muted/30 transition-colors border-border/50">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="font-bold text-foreground text-sm tracking-tight">{src.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase bg-background/50 border-border/50 px-2 py-0.5">
                        {src.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-mono text-[10px] opacity-70">
                        <Globe className="w-3 h-3" />
                        <span className="truncate block max-w-[250px]">{src.baseUrl}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => onEdit(src)}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete(src.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
