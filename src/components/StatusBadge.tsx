
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      "px-3 py-1 text-xs font-medium rounded-full border",
      getStatusStyles(),
      className
    )}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
