class Router {
    constructor() {
        this.routes = {
            '/login': this.renderLogin,
            '/': this.renderHome,
            '/triage': this.renderTriage,
            '/new-ticket': this.renderNewTicket,
            '/tickets': this.renderTicketsList,
            '/ticket': this.renderTicketDetail,
            '/dashboard': this.renderDashboard,
            '/admin': this.renderAdmin,
            '/unauthorized': this.renderUnauthorized
        };

        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, params] = hash.split('?');
        const [route, ...pathParts] = path.split('/').filter(p => p);
        
        let routeKey = '/' + (route || '');
        
        // Handle parameterized routes
        if (route === 'ticket' && pathParts.length > 0) {
            routeKey = '/ticket';
        }
        
        const routeHandler = this.routes[routeKey];
        
        if (routeHandler) {
            try {
                routeHandler.call(this, pathParts[0], this.parseParams(params));
            } catch (error) {
                console.error('Route error:', error);
                this.renderError(error.message);
            }
        } else {
            this.render404();
        }
    }

    parseParams(paramString) {
        if (!paramString) return {};
        
        const params = {};
        paramString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
        return params;
    }

    navigate(path) {
        window.location.hash = path;
    }

    renderLogin() {
        if (window.authManager.isAuthenticated()) {
            this.navigate('/');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-card fade-in">
                    <div class="text-center mb-4">
                        <div class="logo-icon mx-auto mb-3">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <h1 class="text-gradient mb-2">Sistema de Tickets</h1>
                        <p class="text-muted">Faça login para continuar</p>
                    </div>
                    
                    <form id="loginForm" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control form-control-glass" id="email" required>
                            <div class="invalid-feedback">
                                Por favor, insira um email válido.
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="password" class="form-label">Senha</label>
                            <input type="password" class="form-control form-control-glass" id="password" required>
                            <div class="invalid-feedback">
                                Por favor, insira sua senha.
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary-custom w-100 mb-4" id="loginBtn">
                            <span class="login-text">Entrar</span>
                            <div class="spinner d-none"></div>
                        </button>
                    </form>
                    
                    <div class="glass-card">
                        <h6 class="text-center mb-3">Contas de Demonstração</h6>
                        <div class="row g-2">
                            <div class="col-4">
                                <button class="btn btn-outline-custom w-100 demo-login" data-role="requester">
                                    Solicitante
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-outline-custom w-100 demo-login" data-role="analyst">
                                    Analista
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-outline-custom w-100 demo-login" data-role="admin">
                                    Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupLoginHandlers();
    }

    renderHome() {
        if (!window.authManager.requireAuth()) return;

        const user = window.authManager.currentUser;
        const stats = window.ticketManager.getStatusStats();
        
        const app = document.getElementById('app');
        app.innerHTML = `
            ${this.renderHeader()}
            <div class="container-fluid py-4">
                <div class="page-header fade-in">
                    <h1 class="page-title">Bem-vindo, ${user.name}!</h1>
                    <p class="page-subtitle">Gerencie seus tickets e solicitações</p>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="glass-card text-center">
                            <div class="category-icon mx-auto mb-2">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                            <h3 class="text-gradient">${stats.total}</h3>
                            <p class="mb-0">Total de Tickets</p>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="glass-card text-center">
                            <div class="category-icon mx-auto mb-2">
                                <i class="fas fa-clock"></i>
                            </div>
                            <h3 class="text-gradient">${stats.open}</h3>
                            <p class="mb-0">Abertos</p>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="glass-card text-center">
                            <div class="category-icon mx-auto mb-2">
                                <i class="fas fa-spinner"></i>
                            </div>
                            <h3 class="text-gradient">${stats.in_progress}</h3>
                            <p class="mb-0">Em Andamento</p>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="glass-card text-center">
                            <div class="category-icon mx-auto mb-2">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3 class="text-gradient">${stats.resolved}</h3>
                            <p class="mb-0">Resolvidos</p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="glass-card">
                            <h3 class="mb-4">Criar Nova Solicitação</h3>
                            <div class="row">
                                ${Object.entries(window.ticketManager.categories).map(([key, category]) => `
                                    <div class="col-md-4 mb-3">
                                        <div class="category-card slide-in" onclick="router.navigate('/new-ticket?category=${key}')">
                                            <div class="category-icon">
                                                <i class="${category.icon}"></i>
                                            </div>
                                            <h5>${category.name}</h5>
                                            <p class="text-muted small">${category.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="glass-card">
                            <h3 class="mb-4">Ações Rápidas</h3>
                            <div class="d-grid gap-3">
                                <button class="btn btn-outline-custom" onclick="router.navigate('/tickets')">
                                    <i class="fas fa-list me-2"></i>
                                    Ver Meus Tickets
                                </button>
                                ${user.role !== 'requester' ? `
                                    <button class="btn btn-outline-custom" onclick="router.navigate('/dashboard')">
                                        <i class="fas fa-chart-bar me-2"></i>
                                        Dashboard
                                    </button>
                                ` : ''}
                                ${user.role === 'admin' ? `
                                    <button class="btn btn-outline-custom" onclick="router.navigate('/admin')">
                                        <i class="fas fa-cog me-2"></i>
                                        Administração
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTriage() {
        // Implementation for triage page
    }

    renderNewTicket() {
        // Implementation for new ticket page
    }

    renderTicketsList() {
        // Implementation for tickets list page
    }

    renderTicketDetail() {
        // Implementation for ticket detail page
    }

    renderDashboard() {
        // Implementation for dashboard page
    }

    renderAdmin() {
        // Implementation for admin page
    }

    renderUnauthorized() {
        // Implementation for unauthorized access page
    }

    renderError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid py-5">
                <div class="glass-card text-center">
                    <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                    <h2>Erro</h2>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary-custom" onclick="router.navigate('/')">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        `;
    }

    render404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid py-5">
                <div class="glass-card text-center">
                    <i class="fas fa-search text-muted mb-3" style="font-size: 3rem;"></i>
                    <h2>Página não encontrada</h2>
                    <p class="text-muted">A página que você está procurando não existe.</p>
                    <button class="btn btn-primary-custom" onclick="router.navigate('/')">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        `;
    }

    renderHeader() {
        const user = window.authManager.currentUser;
        if (!user) return '';

        return `
            <header class="main-header">
                <div class="container-fluid">
                    <nav class="navbar navbar-expand-lg">
                        <a class="logo-container" href="#/" onclick="router.navigate('/')">
                            <div class="logo-icon">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                            Sistema de Tickets
                        </a>
                        
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link-custom" href="#/" onclick="router.navigate('/')">
                                        <i class="fas fa-home me-1"></i>Início
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link-custom" href="#/tickets" onclick="router.navigate('/tickets')">
                                        <i class="fas fa-list me-1"></i>Meus Tickets
                                    </a>
                                </li>
                                ${user.role !== 'requester' ? `
                                    <li class="nav-item">
                                        <a class="nav-link-custom" href="#/dashboard" onclick="router.navigate('/dashboard')">
                                            <i class="fas fa-chart-bar me-1"></i>Dashboard
                                        </a>
                                    </li>
                                ` : ''}
                                ${user.role === 'admin' ? `
                                    <li class="nav-item">
                                        <a class="nav-link-custom" href="#/admin" onclick="router.navigate('/admin')">
                                            <i class="fas fa-cog me-1"></i>Admin
                                        </a>
                                    </li>
                                ` : ''}
                            </ul>
                            
                            <div class="navbar-nav">
                                <div class="nav-item dropdown">
                                    <a class="nav-link-custom dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                        <i class="fas fa-user-circle me-1"></i>
                                        ${user.name} (${user.role})
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end glass">
                                        <li><a class="dropdown-item" href="#" onclick="window.authManager.logout()">
                                            <i class="fas fa-sign-out-alt me-2"></i>Sair
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        `;
    }

    setupLoginHandlers() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                loginBtn.disabled = true;
                document.querySelector('.login-text').classList.add('d-none');
                document.querySelector('.spinner').classList.remove('d-none');
                
                await window.authManager.login(email, password);
                this.showToast('Login realizado com sucesso!', 'success');
                this.navigate('/');
            } catch (error) {
                this.showToast(error.message, 'error');
            } finally {
                loginBtn.disabled = false;
                document.querySelector('.login-text').classList.remove('d-none');
                document.querySelector('.spinner').classList.add('d-none');
            }
        });
        
        // Demo login buttons
        document.querySelectorAll('.demo-login').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const role = e.target.dataset.role;
                const emails = {
                    'requester': 'requester@example.com',
                    'analyst': 'analyst@example.com',
                    'admin': 'admin@example.com'
                };
                
                try {
                    await window.authManager.login(emails[role], 'password');
                    this.showToast(`Login como ${role} realizado!`, 'success');
                    this.navigate('/');
                } catch (error) {
                    this.showToast(error.message, 'error');
                }
            });
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-custom position-fixed top-0 end-0 m-3 p-3 ${type === 'error' ? 'border-danger' : type === 'success' ? 'border-success' : 'border-info'}`;
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle text-danger' : type === 'success' ? 'check-circle text-success' : 'info-circle text-info'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    renderError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid py-5">
                <div class="glass-card text-center">
                    <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                    <h2>Erro</h2>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary-custom" onclick="router.navigate('/')">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        `;
    }

    render404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid py-5">
                <div class="glass-card text-center">
                    <i class="fas fa-search text-muted mb-3" style="font-size: 3rem;"></i>
                    <h2>Página não encontrada</h2>
                    <p class="text-muted">A página que você está procurando não existe.</p>
                    <button class="btn btn-primary-custom" onclick="router.navigate('/')">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        `;
    }
}

window.router = new Router();
