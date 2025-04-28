import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'card' | 'inline' | 'rows';
  rows?: number;
  height?: string | number;
  width?: string | number;
  animated?: boolean;
  className?: string;
  hasGradient?: boolean;
}

export function LoadingState({
  type = 'card',
  rows = 3,
  height = 'auto',
  width = 'full',
  animated = true,
  className,
  hasGradient = true
}: LoadingStateProps) {
  // Define height class based on input
  const heightClass = typeof height === 'string'
    ? `h-${height}`
    : `h-[${height}px]`;

  // Define width class based on input
  const widthClass = typeof width === 'string'
    ? `w-${width}`
    : `w-[${width}px]`;

  // Base animation class
  const animationClass = animated ? 'animate-pulse' : '';

  // Gradient overlay for more polished appearance
  const gradientOverlay = hasGradient ? (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
  ) : null;

  // Card-style loading state
  if (type === 'card') {
    return (
      <Card className={cn(
        "glass-card overflow-hidden relative",
        heightClass,
        widthClass,
        animationClass,
        className
      )}>
        {gradientOverlay}
        <CardContent className="p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-2/3 bg-white/10 rounded" />
          <Skeleton className="h-24 w-full bg-white/5 rounded" />
          <div className="flex justify-between gap-4">
            <Skeleton className="h-8 w-1/3 bg-white/10 rounded" />
            <Skeleton className="h-8 w-1/3 bg-white/10 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Inline loading spinner
  if (type === 'inline') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-4 w-4 rounded-full border-2 border-nova/30 border-t-nova animate-spin" />
        <span className="text-sm text-white/70">Loading...</span>
      </div>
    );
  }

  // Row-based skeleton
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "bg-white/10 rounded",
            animationClass,
            index === 0 ? "h-8 w-3/4" : "h-6 w-full"
          )}
        />
      ))}
      {gradientOverlay}
    </div>
  );
}
