
class Router {
    constructor() {
        this.routes = {
            '': () => this.checkAuth() ? this.renderHome() : this.renderLogin(),
            'login': () => this.renderLogin(),
            'home': () => this.requireAuth(() => this.renderHome()),
            'tickets': () => this.requireAuth(() => this.renderTickets()),
            'new-ticket': () => this.requireAuth(() => this.renderNewTicket()),
            'ticket': () => this.requireAuth(() => this.renderTicketDetail()),
            'admin': () => this.requireAuth(() => this.renderAdmin()),
            'dashboard': () => this.requireAuth(() => this.renderDashboard())
        };

        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());
    }

    route() {
        const hash = window.location.hash.slice(1);
        const [path, ...params] = hash.split('/');
        this.currentParams = params;
        
        const handler = this.routes[path] || (() => this.render404());
        handler();
    }

    checkAuth() {
        return window.authManager.isAuthenticated();
    }

    requireAuth(callback) {
        if (this.checkAuth()) {
            callback();
        } else {
            window.location.hash = '#/login';
        }
    }

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(radial-circle, #ffffff, #f3f4f6);">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6 col-lg-4">
                            <div class="text-center mb-4">
                                <h1 class="h2 fw-bold mb-2" style="background: linear-gradient(135deg, var(--logo-blue), var(--logo-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                    Ticket System
                                </h1>
                                <p class="text-muted">Sign in to manage your tickets</p>
                            </div>
                            
                            <div class="glass-card p-4 mb-4">
                                <form id="loginForm">
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control form-control-custom" id="email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control form-control-custom" id="password" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary-custom w-100">Sign In</button>
                                </form>
                            </div>
                            
                            <div class="glass-card p-4">
                                <h5 class="text-center mb-3">Demo Accounts</h5>
                                <p class="text-center text-muted small mb-3">Click below to login with a demo account</p>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <button class="btn btn-outline-custom w-100" onclick="loginAs('requester')">Requester</button>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-outline-custom w-100" onclick="loginAs('analyst')">Analyst</button>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-outline-custom w-100" onclick="loginAs('admin')">Admin</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await window.authManager.login(email, password);
                window.location.hash = '#/home';
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }

    renderMainLayout(content) {
        const user = window.authManager.currentUser;
        return `
            <div class="min-vh-100" style="background-color: var(--background);">
                <header class="main-header header-gradient glass">
                    <div class="container">
                        <div class="d-flex align-items-center justify-content-between py-3">
                            <a href="#/home" class="logo-container">
                                <img src="/lovable-uploads/500ab463-8a13-48d8-a38c-5966f6f16a7b.png" alt="Logo" class="logo-img">
                                <h1 class="h4 mb-0 text-white fw-bold">Ticket System</h1>
                            </a>
                            
                            <nav class="d-none d-md-flex align-items-center">
                                <ul class="nav me-4">
                                    <li class="nav-item">
                                        <a class="nav-link-custom" href="#/home">Home</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link-custom" href="#/tickets">My Tickets</a>
                                    </li>
                                    ${user.role === 'admin' ? '<li class="nav-item"><a class="nav-link-custom" href="#/admin">Admin</a></li>' : ''}
                                    ${(user.role === 'admin' || user.role === 'analyst') ? '<li class="nav-item"><a class="nav-link-custom" href="#/dashboard">Dashboard</a></li>' : ''}
                                </ul>
                                
                                <div class="d-flex align-items-center gap-3">
                                    <div class="text-white small">
                                        <span class="fw-medium">${user.name}</span>
                                        <span class="opacity-75">(${user.role})</span>
                                    </div>
                                    <button class="btn btn-custom btn-sm" onclick="window.authManager.logout()">Logout</button>
                                </div>
                            </nav>
                            
                            <button class="btn btn-custom d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                        
                        <div class="collapse d-md-none" id="mobileMenu">
                            <div class="mobile-menu p-3">
                                <nav class="mb-3">
                                    <ul class="nav flex-column">
                                        <li class="nav-item"><a class="nav-link-custom" href="#/home">Home</a></li>
                                        <li class="nav-item"><a class="nav-link-custom" href="#/tickets">My Tickets</a></li>
                                        ${user.role === 'admin' ? '<li class="nav-item"><a class="nav-link-custom" href="#/admin">Admin</a></li>' : ''}
                                        ${(user.role === 'admin' || user.role === 'analyst') ? '<li class="nav-item"><a class="nav-link-custom" href="#/dashboard">Dashboard</a></li>' : ''}
                                    </ul>
                                </nav>
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="small">
                                        <span class="fw-medium">${user.name}</span>
                                        <span class="text-muted">(${user.role})</span>
                                    </div>
                                    <button class="btn btn-outline-custom btn-sm" onclick="window.authManager.logout()">Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main class="container py-4">
                    ${content}
                </main>
                
                <footer class="bg-light bg-opacity-10 mt-5 py-3 border-top" style="border-color: rgba(255, 255, 255, 0.2) !important;">
                    <div class="container text-center">
                        <p class="small text-muted mb-0">&copy; ${new Date().getFullYear()} Ticket Registration System. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        `;
    }

    renderHome() {
        const user = window.authManager.currentUser;
        const content = `
            <div class="text-center mb-5">
                <h1 class="h2 fw-bold mb-2">Welcome, ${user.name}!</h1>
                <p class="text-muted">Create a new ticket request or manage your existing tickets.</p>
            </div>
            
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <h3 class="h5 fw-semibold mb-4">Create a New Request</h3>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="glass-card p-4 category-card h-100" onclick="window.location.hash='#/new-ticket/PADE'">
                                <h4 class="h5 fw-semibold mb-2">PADE</h4>
                                <p class="text-muted mb-4">Create a PADE request for account and client management related issues.</p>
                                <button class="btn btn-primary-custom w-100">Create Request</button>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="glass-card p-4 category-card h-100" onclick="window.location.hash='#/new-ticket/META'">
                                <h4 class="h5 fw-semibold mb-2">META</h4>
                                <p class="text-muted mb-4">Submit a META request for target and performance related adjustments.</p>
                                <button class="btn btn-primary-custom w-100">Create Request</button>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="glass-card p-4 category-card h-100" onclick="window.location.hash='#/new-ticket/ENCARTEIRAMENTO_POR_EXCECAO'">
                                <h4 class="h5 fw-semibold mb-2">ENCARTEIRAMENTO POR EXCEÇÃO</h4>
                                <p class="text-muted mb-4">Request exceptional portfolio management changes and reassignments.</p>
                                <button class="btn btn-primary-custom w-100">Create Request</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-5">
                        <a href="#/tickets" class="btn btn-outline-custom">View My Tickets</a>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('app').innerHTML = this.renderMainLayout(content);
    }

    renderTickets() {
        const tickets = window.ticketManager.getUserTickets();
        const content = `
            <div class="mb-4">
                <h1 class="h2 fw-bold mb-2">My Tickets</h1>
                <p class="text-muted">View and manage your ticket requests</p>
            </div>
            
            <div class="mb-4">
                <div class="input-group" style="max-width: 400px;">
                    <span class="input-group-text">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search tickets..." id="searchInput">
                </div>
            </div>
            
            <div id="ticketsList">
                ${tickets.length === 0 ? 
                    `<div class="glass-card p-5 text-center">
                        <h4 class="h5 fw-medium mb-2">No tickets found</h4>
                        <p class="text-muted mb-4">You don't have any tickets yet</p>
                        <a href="#/home" class="btn btn-primary-custom">Create a new ticket</a>
                    </div>` :
                    tickets.map(ticket => `
                        <div class="glass-card p-4 mb-3 ticket-card" onclick="window.location.hash='#/ticket/${ticket.id}'">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h5 class="fw-medium mb-1">${this.getCategoryDisplayName(ticket.category)} - ${ticket.solicitationNumber}</h5>
                                    <p class="text-muted small mb-0">Agency: ${ticket.agency} | Account: ${ticket.accountNumber}</p>
                                </div>
                                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                    <span class="status-badge status-${ticket.status.replace('_', '-')}">${this.getStatusDisplayName(ticket.status)}</span>
                                    <p class="text-muted small mt-1 mb-0">Last updated: ${new Date(ticket.lastInteractionAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        document.getElementById('app').innerHTML = this.renderMainLayout(content);
        
        // Add search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filteredTickets = tickets.filter(ticket => 
                    ticket.solicitationNumber.toLowerCase().includes(term) ||
                    ticket.agency.toLowerCase().includes(term) ||
                    ticket.accountNumber.toLowerCase().includes(term)
                );
                this.updateTicketsList(filteredTickets);
            });
        }
    }

    updateTicketsList(tickets) {
        const ticketsList = document.getElementById('ticketsList');
        if (ticketsList) {
            ticketsList.innerHTML = tickets.length === 0 ? 
                `<div class="glass-card p-5 text-center">
                    <h4 class="h5 fw-medium mb-2">No tickets found</h4>
                    <p class="text-muted">No tickets match your search criteria</p>
                </div>` :
                tickets.map(ticket => `
                    <div class="glass-card p-4 mb-3 ticket-card" onclick="window.location.hash='#/ticket/${ticket.id}'">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <h5 class="fw-medium mb-1">${this.getCategoryDisplayName(ticket.category)} - ${ticket.solicitationNumber}</h5>
                                <p class="text-muted small mb-0">Agency: ${ticket.agency} | Account: ${ticket.accountNumber}</p>
                            </div>
                            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                <span class="status-badge status-${ticket.status.replace('_', '-')}">${this.getStatusDisplayName(ticket.status)}</span>
                                <p class="text-muted small mt-1 mb-0">Last updated: ${new Date(ticket.lastInteractionAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
        }
    }

    getCategoryDisplayName(category) {
        const names = {
            'PADE': 'PADE',
            'META': 'META',
            'ENCARTEIRAMENTO_POR_EXCECAO': 'ENCARTEIRAMENTO POR EXCEÇÃO'
        };
        return names[category] || category;
    }

    getStatusDisplayName(status) {
        const names = {
            'open': 'Open',
            'in_progress': 'In Progress',
            'resolved': 'Resolved'
        };
        return names[status] || status;
    }

    render404() {
        document.getElementById('app').innerHTML = `
            <div class="min-vh-100 d-flex align-items-center justify-content-center">
                <div class="text-center">
                    <h1 class="display-1 fw-bold">404</h1>
                    <p class="h4 text-muted mb-4">Page not found</p>
                    <a href="#/home" class="btn btn-primary-custom">Return to Home</a>
                </div>
            </div>
        `;
    }
}

// Helper function for demo login
window.loginAs = async function(role) {
    const emailMap = {
        'requester': 'requester@example.com',
        'analyst': 'analyst@example.com',
        'admin': 'admin@example.com'
    };
    
    try {
        await window.authManager.login(emailMap[role], 'password');
        window.location.hash = '#/home';
    } catch (error) {
        alert('Login failed');
    }
};
