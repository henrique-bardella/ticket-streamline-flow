
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize router
    window.router = new Router();
    
    // Add global event listeners
    document.addEventListener('click', function(e) {
        // Handle navigation links
        if (e.target.matches('[data-navigate]')) {
            e.preventDefault();
            const hash = e.target.getAttribute('data-navigate');
            window.location.hash = hash;
        }
    });
    
    // Update active nav links
    window.addEventListener('hashchange', updateActiveNavLinks);
    updateActiveNavLinks();
});

function updateActiveNavLinks() {
    const currentHash = window.location.hash.slice(1);
    const navLinks = document.querySelectorAll('.nav-link-custom');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.slice(1) === currentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Utility functions
function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
