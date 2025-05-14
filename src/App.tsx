
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { TicketProvider } from "./contexts/TicketContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Tickets from "./pages/Tickets";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import AuthLayout from "./components/layout/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TicketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/new-ticket/:category" element={<NewTicket />} />
                <Route path="/ticket/:ticketId" element={<TicketDetail />} />
              </Route>
              
              {/* Analyst & Admin only routes */}
              <Route element={<AuthLayout requiredRole={['analyst', 'admin']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              
              {/* Admin only routes */}
              <Route element={<AuthLayout requiredRole="admin" />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TicketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
