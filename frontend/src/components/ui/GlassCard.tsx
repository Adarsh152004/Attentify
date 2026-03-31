import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300 hover:bg-card/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
