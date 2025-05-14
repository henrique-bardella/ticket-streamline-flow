
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import StyledButton from "../StyledButton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NavItemProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavItem = ({ to, label, currentPath }: NavItemProps) => {
  const isActive = currentPath === to;
  
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "block px-4 py-2 rounded-lg transition-all",
          isActive
            ? "bg-gradient-to-r from-logo-blue via-logo-purple to-logo-red text-white"
            : "hover:bg-white/20"
        )}
      >
        {label}
      </Link>
    </li>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm bg-gradient-to-br from-logo-blue via-logo-purple to-logo-red">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <AspectRatio ratio={1/1}>
                <img 
                  src="/lovable-uploads/500ab463-8a13-48d8-a38c-5966f6f16a7b.png" 
                  alt="Logo" 
                  className="object-contain" 
                />
              </AspectRatio>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Ticket System
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex items-center space-x-2">
                <NavItem to="/" label="Home" currentPath={currentPath} />
                <NavItem to="/tickets" label="My Tickets" currentPath={currentPath} />
                {currentUser?.role === 'admin' && (
                  <NavItem to="/admin" label="Admin" currentPath={currentPath} />
                )}
                {(currentUser?.role === 'admin' || currentUser?.role === 'analyst') && (
                  <NavItem to="/dashboard" label="Dashboard" currentPath={currentPath} />
                )}
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-white">
                <span className="font-medium">{currentUser?.name}</span>
                <span className="ml-1 text-xs text-white/80">({currentUser?.role})</span>
              </div>
              <StyledButton 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Logout
              </StyledButton>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card mx-4 mb-4 rounded-b-xl">
            <nav className="py-2">
              <ul className="space-y-2 px-4">
                <NavItem to="/" label="Home" currentPath={currentPath} />
                <NavItem to="/tickets" label="My Tickets" currentPath={currentPath} />
                {currentUser?.role === 'admin' && (
                  <NavItem to="/admin" label="Admin" currentPath={currentPath} />
                )}
                {(currentUser?.role === 'admin' || currentUser?.role === 'analyst') && (
                  <NavItem to="/dashboard" label="Dashboard" currentPath={currentPath} />
                )}
              </ul>
            </nav>
            <div className="flex items-center justify-between px-4 py-4 border-t border-white/20">
              <div className="text-sm text-white">
                <span className="font-medium">{currentUser?.name}</span>
                <span className="ml-1 text-xs text-white/80">({currentUser?.role})</span>
              </div>
              <StyledButton 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Logout
              </StyledButton>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white/10 backdrop-blur-sm mt-12 py-6 border-t border-white/20">
        <div className="container mx-auto px-4 text-center text-sm text-white/80">
          <p>&copy; {new Date().getFullYear()} Ticket Registration System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
