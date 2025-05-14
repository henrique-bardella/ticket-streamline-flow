
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/GlassCard";
import StyledButton from "@/components/StyledButton";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Provide demo credentials
  const loginAs = async (role: string) => {
    setLoading(true);
    try {
      let email = "";
      switch (role) {
        case "requester":
          email = "requester@example.com";
          break;
        case "analyst":
          email = "analyst@example.com";
          break;
        case "admin":
          email = "admin@example.com";
          break;
        default:
          return;
      }
      
      await login(email, "password");
      toast.success(`Logged in as ${role}`);
      navigate("/");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-white to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
            Ticket System
          </h1>
          <p className="text-gray-600">Sign in to manage your tickets</p>
        </div>

        <GlassCard className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="glass-input"
              />
            </div>

            <StyledButton
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Sign In"}
            </StyledButton>
          </form>
        </GlassCard>

        <GlassCard>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">Demo Accounts</h3>
            <p className="text-sm text-center text-gray-500">
              Click below to login with a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              <StyledButton
                variant="outline"
                onClick={() => loginAs("requester")}
                disabled={loading}
              >
                Requester
              </StyledButton>
              <StyledButton
                variant="outline"
                onClick={() => loginAs("analyst")}
                disabled={loading}
              >
                Analyst
              </StyledButton>
              <StyledButton
                variant="outline"
                onClick={() => loginAs("admin")}
                disabled={loading}
              >
                Admin
              </StyledButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
