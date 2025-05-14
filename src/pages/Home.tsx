
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import StyledButton from "@/components/StyledButton";
import { useAuth } from "@/contexts/AuthContext";
import { TicketCategory } from "@/types";

const CategoryCard = ({ 
  title, 
  description, 
  category 
}: { 
  title: string; 
  description: string; 
  category: TicketCategory;
}) => (
  <GlassCard className="flex flex-col h-full">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
    <div className="mt-auto">
      <Link to={`/new-ticket/${category}`}>
        <StyledButton fullWidth>Create Request</StyledButton>
      </Link>
    </div>
  </GlassCard>
);

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <MainLayout>
      <div className="mb-12 text-center">
        <PageHeader 
          title={`Welcome, ${currentUser?.name}!`} 
          description="Create a new ticket request or manage your existing tickets."
          className="text-center"
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Create a New Request</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <CategoryCard
            title="PADE"
            description="Create a PADE request for account and client management related issues."
            category="PADE"
          />
          <CategoryCard
            title="META"
            description="Submit a META request for target and performance related adjustments."
            category="META"
          />
          <CategoryCard
            title="ENCARTEIRAMENTO POR EXCEÇÃO"
            description="Request exceptional portfolio management changes and reassignments."
            category="ENCARTEIRAMENTO_POR_EXCECAO"
          />
        </div>

        <div className="mt-12 text-center">
          <Link to="/tickets">
            <StyledButton variant="outline">View My Tickets</StyledButton>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
