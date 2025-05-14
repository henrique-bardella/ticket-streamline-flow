
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import InputField from "@/components/InputField";
import StyledButton from "@/components/StyledButton";
import { useTickets } from "@/contexts/TicketContext";
import { categoryFormFields } from "@/utils/formFields";
import { TicketCategory } from "@/types";
import { toast } from "sonner";

const NewTicket = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { createTicket } = useTickets();

  // Validate the category
  const validCategory = Object.values(['PADE', 'META', 'ENCARTEIRAMENTO_POR_EXCECAO']).includes(category || '');

  // Redirect if invalid category
  useEffect(() => {
    if (!validCategory && category) {
      toast.error("Invalid category selected");
      navigate("/");
    }
  }, [category, validCategory, navigate]);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form values
  useEffect(() => {
    if (validCategory && category) {
      // Get the form fields for the current category
      const fields = categoryFormFields[category as TicketCategory];
      const initialValues: Record<string, string> = {};
      
      // Initialize all fields with empty values
      Object.keys(fields).forEach((fieldName) => {
        initialValues[fieldName] = '';
      });
      
      setFormValues(initialValues);
    }
  }, [category, validCategory]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error when field is edited
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  const validateForm = () => {
    if (!category) return false;
    
    const fields = categoryFormFields[category as TicketCategory];
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.entries(fields).forEach(([fieldName, field]) => {
      if (field.required && !formValues[fieldName]) {
        newErrors[fieldName] = `${field.label} is required`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Extract the base fields and additional fields
      const { solicitationNumber, agency, accountNumber, ...additionalFields } = formValues;
      
      await createTicket({
        category: category as TicketCategory,
        solicitationNumber,
        agency,
        accountNumber,
        additionalFields,
      });
      
      toast.success("Ticket created successfully");
      navigate("/tickets");
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryDisplayName = (category?: string) => {
    switch (category) {
      case 'PADE':
        return 'PADE';
      case 'META':
        return 'META';
      case 'ENCARTEIRAMENTO_POR_EXCECAO':
        return 'ENCARTEIRAMENTO POR EXCEÇÃO';
      default:
        return '';
    }
  };

  if (!validCategory || !category) {
    return null; // This will only show briefly before redirect
  }

  return (
    <MainLayout>
      <PageHeader 
        title={`New ${getCategoryDisplayName(category)} Request`}
        description="Please fill out the form below to create a new request"
      />
      
      <div className="max-w-2xl mx-auto">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {category && Object.entries(categoryFormFields[category as TicketCategory]).map(([fieldName, field]) => (
              <InputField
                key={fieldName}
                id={fieldName}
                label={field.label}
                type={field.type}
                value={formValues[fieldName] || ''}
                onChange={(value) => handleInputChange(fieldName, value)}
                required={field.required}
                placeholder={field.placeholder}
                error={errors[fieldName]}
                options={field.options}
              />
            ))}

            <div className="flex justify-end space-x-4 pt-4">
              <StyledButton
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </StyledButton>
              <StyledButton
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </StyledButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default NewTicket;
