import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export default function CategorySelector({ categories, currentCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return Object.keys(categories).filter(cat => 
      cat.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!categories) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-9 px-4 gap-3 bg-muted/20 border border-transparent hover:border-border/50 hover:bg-muted/40 transition-all duration-300 rounded-xl group",
          isOpen && "bg-muted/40 border-border/50 ring-1 ring-primary/20"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Filter className={cn("w-2.5 h-2.5 text-primary transition-transform duration-500", isOpen && "rotate-180")} />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-0.5">Category</span>
            <span className="text-[10px] font-black text-foreground uppercase tracking-wider truncate max-w-[120px]">
              {currentCategory || 'Select...'}
            </span>
          </div>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-all duration-300 group-hover:text-primary", isOpen && "rotate-180 text-primary")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-card/95 backdrop-blur-xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header & Search */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Filter</span>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                autoFocus
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 text-[11px] bg-background/50 border-border/50 focus-visible:ring-primary/30 rounded-xl"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelect(cat);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all group/item",
                    currentCategory === cat 
                      ? "bg-primary/20 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                  )}
                >
                  <span className="truncate">{cat}</span>
                  {currentCategory === cat && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  )}
                  {currentCategory !== cat && (
                    <div className="w-1 h-1 rounded-full bg-border group-hover/item:bg-primary/40 transition-colors" />
                  )}
                </button>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No segments found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-muted/10 border-t border-border flex justify-between items-center">
            <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              {filteredCategories.length} Categories Available
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
