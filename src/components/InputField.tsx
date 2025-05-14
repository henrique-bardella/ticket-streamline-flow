
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  options?: { value: string; label: string }[];
}

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  error,
  className,
  options,
}: InputFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "glass-input",
            error && "border-red-500 focus:ring-red-500"
          )}
        />
      ) : type === "select" ? (
        <Select value={value} onValueChange={(val) => onChange(val)}>
          <SelectTrigger className={cn(
            "glass-input",
            error && "border-red-500 focus:ring-red-500"
          )}>
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md">
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "glass-input",
            error && "border-red-500 focus:ring-red-500"
          )}
        />
      )}
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
