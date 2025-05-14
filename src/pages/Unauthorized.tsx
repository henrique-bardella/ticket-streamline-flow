
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import StyledButton from "@/components/StyledButton";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-radial from-white to-gray-100 p-4">
      <GlassCard className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">Access Denied</h1>
        <p className="text-lg mb-6">
          You don't have permission to view this page
        </p>
        <div className="space-y-4">
          <StyledButton
            onClick={() => navigate(-1)}
            fullWidth
          >
            Go Back
          </StyledButton>
          <Link to="/">
            <StyledButton
              variant="outline"
              fullWidth
            >
              Return to Home
            </StyledButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Unauthorized;
