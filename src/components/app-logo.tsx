import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg font-medium",
        className
      )}
    >
      <Scissors className="h-5 w-5" />
      <span className="font-headline text-xl">Couturier Numérique</span>
    </div>
  );
}
