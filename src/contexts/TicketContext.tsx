
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Ticket, TicketCategory, TicketStatus, User } from '../types';
import { useAuth } from './AuthContext';

interface TicketContextType {
  tickets: Ticket[];
  userTickets: Ticket[];
  assignedTickets: Ticket[];
  allTickets: Ticket[];
  loading: boolean;
  createTicket: (ticketData: Partial<Ticket>) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  assignTicket: (ticketId: string, analystId: string) => Promise<void>;
  addInteraction: (ticketId: string, message: string) => Promise<void>;
  getTicket: (ticketId: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | null>(null);

// Generate a mock ticket ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate loading tickets from storage/API
    const storedTickets = localStorage.getItem('tickets');
    
    if (storedTickets) {
      try {
        const parsedTickets = JSON.parse(storedTickets);
        setTickets(parsedTickets.map((ticket: any) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt),
          lastInteractionAt: new Date(ticket.lastInteractionAt),
          interactions: ticket.interactions.map((interaction: any) => ({
            ...interaction,
            timestamp: new Date(interaction.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Failed to parse tickets', error);
        setTickets([]);
      }
    }
    
    setLoading(false);
  }, []);

  // Persist tickets to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets, loading]);

  // Filter tickets based on user role
  const userTickets = currentUser ? tickets.filter(ticket => 
    ticket.requester === currentUser.id
  ) : [];

  const assignedTickets = currentUser ? tickets.filter(ticket =>
    ticket.assignedAnalyst === currentUser.id
  ) : [];

  const allTickets = tickets;

  const createTicket = async (ticketData: Partial<Ticket>): Promise<Ticket> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const now = new Date();
    const newTicket: Ticket = {
      id: generateId(),
      category: ticketData.category as TicketCategory,
      solicitationNumber: ticketData.solicitationNumber || '',
      agency: ticketData.agency || '',
      accountNumber: ticketData.accountNumber || '',
      requester: currentUser.id,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      lastInteractionAt: now,
      additionalFields: ticketData.additionalFields || {},
      interactions: [
        {
          id: generateId(),
          ticketId: '',  // Will be filled below
          userId: currentUser.id,
          userName: currentUser.name,
          message: 'Ticket created',
          timestamp: now
        }
      ]
    };
    
    // Set the ticketId in the first interaction
    newTicket.interactions[0].ticketId = newTicket.id;
    
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  };

  const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const now = new Date();
        return {
          ...ticket,
          status,
          updatedAt: now,
          lastInteractionAt: now,
          interactions: [
            ...ticket.interactions,
            {
              id: generateId(),
              ticketId,
              userId: currentUser.id,
              userName: currentUser.name,
              message: `Status changed to ${status}`,
              timestamp: now
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const assignTicket = async (ticketId: string, analystId: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const now = new Date();
        return {
          ...ticket,
          assignedAnalyst: analystId,
          updatedAt: now,
          lastInteractionAt: now,
          interactions: [
            ...ticket.interactions,
            {
              id: generateId(),
              ticketId,
              userId: currentUser.id,
              userName: currentUser.name,
              message: `Ticket assigned to analyst`,
              timestamp: now
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const addInteraction = async (ticketId: string, message: string) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const now = new Date();
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          updatedAt: now,
          lastInteractionAt: now,
          interactions: [
            ...ticket.interactions,
            {
              id: generateId(),
              ticketId,
              userId: currentUser.id,
              userName: currentUser.name,
              message,
              timestamp: now
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const getTicket = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId);
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      userTickets,
      assignedTickets,
      allTickets,
      loading,
      createTicket,
      updateTicketStatus,
      assignTicket,
      addInteraction,
      getTicket
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
