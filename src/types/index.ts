
export type UserRole = 'requester' | 'analyst' | 'admin';

export type TicketCategory = 'PADE' | 'META' | 'ENCARTEIRAMENTO_POR_EXCECAO';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  category: TicketCategory;
  solicitationNumber: string;
  agency: string;
  accountNumber: string;
  requester: string;
  assignedAnalyst?: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  lastInteractionAt: Date;
  additionalFields: Record<string, any>;
  interactions: TicketInteraction[];
}

export interface TicketInteraction {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export interface CategoryFormFields {
  [key: string]: {
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
  };
}
