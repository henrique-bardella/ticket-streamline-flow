
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader = ({ title, description, className }: PageHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-semibold mb-2 tracking-tight">{title}</h1>
      {description && (
        <p className="opacity-80">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
