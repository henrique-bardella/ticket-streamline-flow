
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn(
      "bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-lg",
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
