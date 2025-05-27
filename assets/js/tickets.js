
class TicketManager {
    constructor() {
        this.tickets = this.getTickets();
        this.nextId = this.getNextId();
        this.categories = {
            'PADE': {
                name: 'PADE',
                icon: 'fas fa-user-tie',
                description: 'Processo de Análise e Desenvolvimento Empresarial',
                fields: {
                    solicitationNumber: { label: 'Número da Solicitação', type: 'text', required: true },
                    agency: { label: 'Agência', type: 'text', required: true },
                    accountNumber: { label: 'Número da Conta', type: 'text', required: true },
                    clientName: { label: 'Nome do Cliente', type: 'text', required: true },
                    clientDocument: { label: 'Documento do Cliente', type: 'text', required: true },
                    businessUnit: { 
                        label: 'Unidade de Negócio', 
                        type: 'select', 
                        required: true,
                        options: ['Retail', 'Corporate', 'Investment']
                    },
                    requestType: {
                        label: 'Tipo de Solicitação',
                        type: 'select',
                        required: true,
                        options: ['Abertura', 'Alteração', 'Encerramento']
                    }
                }
            },
            'META': {
                name: 'META',
                icon: 'fas fa-bullseye',
                description: 'Metas e Objetivos Comerciais',
                fields: {
                    solicitationNumber: { label: 'Número da Solicitação', type: 'text', required: true },
                    agency: { label: 'Agência', type: 'text', required: true },
                    accountNumber: { label: 'Número da Conta', type: 'text', required: true },
                    targetValue: { label: 'Valor da Meta', type: 'number', required: true },
                    period: { label: 'Período (MM/YYYY)', type: 'text', required: true },
                    metricType: {
                        label: 'Tipo de Métrica',
                        type: 'select',
                        required: true,
                        options: ['Receita', 'Volume', 'Captação', 'Cross-sell']
                    },
                    justification: { label: 'Justificativa', type: 'textarea', required: true }
                }
            },
            'ENCARTEIRAMENTO_POR_EXCECAO': {
                name: 'ENCARTEIRAMENTO POR EXCEÇÃO',
                icon: 'fas fa-exchange-alt',
                description: 'Gestão Excepcional de Carteiras',
                fields: {
                    solicitationNumber: { label: 'Número da Solicitação', type: 'text', required: true },
                    agency: { label: 'Agência', type: 'text', required: true },
                    accountNumber: { label: 'Número da Conta', type: 'text', required: true },
                    currentManager: { label: 'Gerente Atual', type: 'text', required: true },
                    requestedManager: { label: 'Gerente Solicitado', type: 'text', required: true },
                    reason: {
                        label: 'Motivo',
                        type: 'select',
                        required: true,
                        options: ['Relacionamento', 'Expertise Setorial', 'Performance', 'Outros']
                    },
                    clientProfile: {
                        label: 'Perfil do Cliente',
                        type: 'select',
                        required: true,
                        options: ['Private', 'Corporate', 'Investment', 'Premium']
                    },
                    additionalInfo: { label: 'Informações Adicionais', type: 'textarea', required: false }
                }
            }
        };
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
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SOL-${timestamp.slice(-6)}${random}`;
    }

    createTicket(ticketData) {
        const ticket = {
            id: this.nextId.toString(),
            solicitationNumber: ticketData.solicitationNumber || this.generateSolicitationNumber(),
            category: ticketData.category,
            status: 'open',
            priority: ticketData.priority || 'medium',
            requesterId: window.authManager.currentUser.id,
            requesterName: window.authManager.currentUser.name,
            assignedAnalyst: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastInteractionAt: new Date().toISOString(),
            data: ticketData.data || {},
            interactions: [{
                id: '1',
                userId: window.authManager.currentUser.id,
                userName: window.authManager.currentUser.name,
                message: 'Ticket criado',
                timestamp: new Date().toISOString(),
                type: 'system'
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

    getUserTickets(userId = null) {
        const currentUserId = userId || window.authManager.currentUser?.id;
        if (!currentUserId) return [];
        
        const userRole = window.authManager.currentUser.role;
        
        switch (userRole) {
            case 'admin':
                return this.tickets;
            case 'analyst':
                return this.tickets.filter(t => 
                    t.assignedAnalyst === currentUserId || 
                    t.assignedAnalyst === null
                );
            case 'requester':
            default:
                return this.tickets.filter(t => t.requesterId === currentUserId);
        }
    }

    updateTicketStatus(ticketId, newStatus, comment = null) {
        const ticket = this.getTicket(ticketId);
        if (!ticket) throw new Error('Ticket not found');

        const oldStatus = ticket.status;
        ticket.status = newStatus;
        ticket.updatedAt = new Date().toISOString();
        ticket.lastInteractionAt = new Date().toISOString();

        // Add interaction for status change
        const interaction = {
            id: Date.now().toString(),
            userId: window.authManager.currentUser.id,
            userName: window.authManager.currentUser.name,
            message: comment || `Status alterado de ${this.getStatusLabel(oldStatus)} para ${this.getStatusLabel(newStatus)}`,
            timestamp: new Date().toISOString(),
            type: 'status_change'
        };

        ticket.interactions.push(interaction);
        this.saveTickets();
        return ticket;
    }

    assignTicket(ticketId, analystId) {
        const ticket = this.getTicket(ticketId);
        if (!ticket) throw new Error('Ticket not found');

        const analyst = window.authManager.users.find(u => u.id === analystId);
        if (!analyst) throw new Error('Analyst not found');

        ticket.assignedAnalyst = analystId;
        ticket.updatedAt = new Date().toISOString();
        ticket.lastInteractionAt = new Date().toISOString();

        const interaction = {
            id: Date.now().toString(),
            userId: window.authManager.currentUser.id,
            userName: window.authManager.currentUser.name,
            message: `Ticket atribuído para ${analyst.name}`,
            timestamp: new Date().toISOString(),
            type: 'assignment'
        };

        ticket.interactions.push(interaction);
        this.saveTickets();
        return ticket;
    }

    addInteraction(ticketId, message, type = 'comment') {
        const ticket = this.getTicket(ticketId);
        if (!ticket) throw new Error('Ticket not found');

        const interaction = {
            id: Date.now().toString(),
            userId: window.authManager.currentUser.id,
            userName: window.authManager.currentUser.name,
            message: message,
            timestamp: new Date().toISOString(),
            type: type
        };

        ticket.interactions.push(interaction);
        ticket.lastInteractionAt = new Date().toISOString();
        ticket.updatedAt = new Date().toISOString();
        
        this.saveTickets();
        return interaction;
    }

    getStatusStats() {
        const stats = { open: 0, in_progress: 0, resolved: 0, total: 0 };
        this.tickets.forEach(ticket => {
            stats[ticket.status]++;
            stats.total++;
        });
        return stats;
    }

    getCategoryStats() {
        const stats = { PADE: 0, META: 0, ENCARTEIRAMENTO_POR_EXCECAO: 0 };
        this.tickets.forEach(ticket => {
            if (stats.hasOwnProperty(ticket.category)) {
                stats[ticket.category]++;
            }
        });
        return stats;
    }

    getStatusLabel(status) {
        const labels = {
            'open': 'Aberto',
            'in_progress': 'Em Andamento',
            'resolved': 'Resolvido'
        };
        return labels[status] || status;
    }

    getPriorityLabel(priority) {
        const labels = {
            'low': 'Baixa',
            'medium': 'Média',
            'high': 'Alta',
            'urgent': 'Urgente'
        };
        return labels[priority] || priority;
    }

    searchTickets(query, filters = {}) {
        let results = this.getUserTickets();
        
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(ticket => 
                ticket.solicitationNumber.toLowerCase().includes(searchTerm) ||
                ticket.category.toLowerCase().includes(searchTerm) ||
                ticket.requesterName.toLowerCase().includes(searchTerm) ||
                JSON.stringify(ticket.data).toLowerCase().includes(searchTerm)
            );
        }

        if (filters.status) {
            results = results.filter(ticket => ticket.status === filters.status);
        }

        if (filters.category) {
            results = results.filter(ticket => ticket.category === filters.category);
        }

        if (filters.priority) {
            results = results.filter(ticket => ticket.priority === filters.priority);
        }

        return results;
    }
}

window.ticketManager = new TicketManager();
