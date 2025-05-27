
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.users = [
            {
                id: '1',
                name: 'João Silva',
                email: 'requester@example.com',
                role: 'requester',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Maria Santos',
                email: 'analyst@example.com',
                role: 'analyst',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
                createdAt: new Date().toISOString()
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
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
        this.redirectTo('/login');
    }

    hasPermission(roles) {
        if (!this.currentUser) return false;
        if (Array.isArray(roles)) {
            return roles.includes(this.currentUser.role);
        }
        return this.currentUser.role === roles;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectTo('/login');
            return false;
        }
        return true;
    }

    requireRole(roles) {
        if (!this.requireAuth()) return false;
        if (!this.hasPermission(roles)) {
            this.redirectTo('/unauthorized');
            return false;
        }
        return true;
    }

    redirectTo(path) {
        window.location.hash = path;
    }

    // User management methods for admin
    getAllUsers() {
        return this.users;
    }

    createUser(userData) {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(userId, userData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            return this.users[userIndex];
        }
        throw new Error('User not found');
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        throw new Error('User not found');
    }
}

window.authManager = new AuthManager();
