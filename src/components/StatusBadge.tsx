
import { cn } from "@/lib/utils";
import { TicketStatus } from "../types";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/30 text-white border-blue-300/30';
      case 'in_progress':
        return 'bg-amber-500/30 text-white border-amber-300/30';
      case 'resolved':
        return 'bg-green-500/30 text-white border-green-300/30';
      default:
        return 'bg-gray-500/30 text-white border-gray-300/30';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm",
      getStatusStyles(),
      className
    )}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
