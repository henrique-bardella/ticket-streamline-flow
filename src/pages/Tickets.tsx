
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import StatusBadge from "@/components/StatusBadge";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Ticket } from "@/types";
import { Search } from "lucide-react";

const Tickets = () => {
  const { userTickets, assignedTickets, allTickets } = useTickets();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  // Determine which tickets to show based on user role
  const ticketsToDisplay = () => {
    if (currentUser?.role === 'admin') {
      return allTickets;
    } else if (currentUser?.role === 'analyst') {
      return assignedTickets;
    } else {
      return userTickets;
    }
  };

  // Filter tickets based on search term
  useEffect(() => {
    const tickets = ticketsToDisplay();
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.solicitationNumber.toLowerCase().includes(term) ||
        ticket.agency.toLowerCase().includes(term) ||
        ticket.accountNumber.toLowerCase().includes(term) ||
        ticket.status.toLowerCase().includes(term)
    );

    setFilteredTickets(filtered);
  }, [searchTerm, userTickets, assignedTickets, allTickets, currentUser]);

  // Get the category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'PADE':
        return 'PADE';
      case 'META':
        return 'META';
      case 'ENCARTEIRAMENTO_POR_EXCECAO':
        return 'ENCARTEIRAMENTO POR EXCEÇÃO';
      default:
        return category;
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="My Tickets" 
        description="View and manage your ticket requests"
        className="text-white"
      />

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <Input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white/20 border-white/30 text-white pl-10 backdrop-blur-md max-w-md placeholder:text-white/70"
        />
      </div>

      {filteredTickets.length === 0 ? (
        <GlassCard className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 text-white">No tickets found</h3>
          <p className="text-white/80 mb-6">
            {searchTerm ? 
              "No tickets match your search criteria" : 
              "You don't have any tickets yet"}
          </p>
          <Link 
            to="/" 
            className="text-white hover:text-white/80 underline"
          >
            Create a new ticket
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
              <GlassCard className="hover:bg-white/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-white">
                      {getCategoryDisplayName(ticket.category)} - {ticket.solicitationNumber}
                    </h3>
                    <p className="text-sm text-white/80">
                      Agency: {ticket.agency} | Account: {ticket.accountNumber}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <StatusBadge status={ticket.status} />
                    <p className="text-xs text-white/80 mt-1">
                      Last updated: {format(new Date(ticket.lastInteractionAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Tickets;
