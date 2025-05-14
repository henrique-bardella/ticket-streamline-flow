
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StyledButtonProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledButton = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  onClick,
  className,
  type = 'button',
  disabled = false,
  fullWidth = false,
}: StyledButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(
        "font-medium transition-all",
        "shadow-sm hover:shadow",
        variant === 'default' && "bg-primary hover:bg-primary-dark text-white",
        variant === 'secondary' && "bg-secondary hover:bg-secondary-dark text-white",
        variant === 'outline' && "border-2 hover:bg-primary/5",
        fullWidth && "w-full",
        className
      )}
      type={type}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
