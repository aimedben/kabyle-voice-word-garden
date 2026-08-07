import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="bg-brand flex h-8 w-8 items-center justify-center rounded-xl shadow-glow">
        <AudioLines className="h-4 w-4 text-primary-foreground" />
      </span>
      {!compact && (
        <span className="font-display text-[1.05rem] font-extrabold tracking-tight">
          Kabyle<span className="text-primary">Voice</span>
        </span>
      )}
    </span>
  );
}
