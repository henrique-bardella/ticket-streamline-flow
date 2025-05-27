
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.users = [
            {
                id: '1',
                name: 'Requester User',
                email: 'requester@example.com',
                role: 'requester'
            },
            {
                id: '2',
                name: 'Analyst User',
                email: 'analyst@example.com',
                role: 'analyst'
            },
            {
                id: '3',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin'
            }
        ];
    }

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    async login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (user && password === 'password') {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid credentials');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.hash = '#/login';
    }

    hasPermission(roles) {
        if (!this.currentUser) return false;
        return roles.includes(this.currentUser.role);
    }
}

window.authManager = new AuthManager();
