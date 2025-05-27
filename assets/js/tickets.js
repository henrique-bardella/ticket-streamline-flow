
class TicketManager {
    constructor() {
        this.tickets = this.getTickets();
        this.nextId = this.getNextId();
    }

    getTickets() {
        const tickets = localStorage.getItem('tickets');
        return tickets ? JSON.parse(tickets) : [];
    }

    saveTickets() {
        localStorage.setItem('tickets', JSON.stringify(this.tickets));
    }

    getNextId() {
        const tickets = this.getTickets();
        return tickets.length > 0 ? Math.max(...tickets.map(t => parseInt(t.id))) + 1 : 1;
    }

    generateSolicitationNumber() {
        return `SOL-${Date.now().toString().slice(-8)}`;
    }

    createTicket(ticketData) {
        const ticket = {
            id: this.nextId.toString(),
            solicitationNumber: this.generateSolicitationNumber(),
            category: ticketData.category,
            agency: ticketData.agency,
            accountNumber: ticketData.accountNumber,
            additionalFields: ticketData.additionalFields || {},
            status: 'open',
            requesterId: window.authManager.currentUser.id,
            requesterName: window.authManager.currentUser.name,
            createdAt: new Date().toISOString(),
            lastInteractionAt: new Date().toISOString(),
            interactions: [{
                id: '1',
                message: 'Ticket created',
                userName: window.authManager.currentUser.name,
                timestamp: new Date().toISOString()
            }]
        };

        this.tickets.push(ticket);
        this.saveTickets();
        this.nextId++;
        return ticket;
    }

    getTicket(id) {
        return this.tickets.find(t => t.id === id);
    }

    getUserTickets() {
        if (!window.authManager.currentUser) return [];
        
        if (window.authManager.currentUser.role === 'admin') {
            return this.tickets;
        } else if (window.authManager.currentUser.role === 'analyst') {
            return this.tickets; // In real app, filter by assigned tickets
        } else {
            return this.tickets.filter(t => t.requesterId === window.authManager.currentUser.id);
        }
    }

    updateTicketStatus(ticketId, newStatus) {
        const ticket = this.getTicket(ticketId);
        if (ticket) {
            ticket.status = newStatus;
            ticket.lastInteractionAt = new Date().toISOString();
            this.addInteraction(ticketId, `Status changed to ${newStatus}`);
            this.saveTickets();
        }
    }

    addInteraction(ticketId, message) {
        const ticket = this.getTicket(ticketId);
        if (ticket) {
            const interaction = {
                id: Date.now().toString(),
                message: message,
                userName: window.authManager.currentUser.name,
                timestamp: new Date().toISOString()
            };
            ticket.interactions.push(interaction);
            ticket.lastInteractionAt = new Date().toISOString();
            this.saveTickets();
        }
    }

    getStatusStats() {
        const stats = { open: 0, in_progress: 0, resolved: 0 };
        this.tickets.forEach(ticket => {
            stats[ticket.status]++;
        });
        return stats;
    }

    getCategoryStats() {
        const stats = { PADE: 0, META: 0, ENCARTEIRAMENTO_POR_EXCECAO: 0 };
        this.tickets.forEach(ticket => {
            stats[ticket.category]++;
        });
        return stats;
    }
}

window.ticketManager = new TicketManager();
