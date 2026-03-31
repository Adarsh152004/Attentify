import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassContainer({ children, className, ...props }: GlassContainerProps) {
  return (
    <div
      className={cn(
        "p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
