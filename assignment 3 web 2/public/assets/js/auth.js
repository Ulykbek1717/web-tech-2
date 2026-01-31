// Authentication Manager for ShopLite
(function() {
  const API_BASE = '/api';
  
  // Authentication Helper Functions
  const Auth = {
    // Save JWT token and user info to localStorage
    saveAuth(token, user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      this.updateUIState();
    },
    
    // Get current token
    getToken() {
      return localStorage.getItem('authToken');
    },
    
    // Get current user
    getUser() {
      const userStr = localStorage.getItem('authUser');
      return userStr ? JSON.parse(userStr) : null;
    },
    
    // Check if user is logged in
    isLoggedIn() {
      return !!this.getToken();
    },
    
    // Logout
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      this.updateUIState();
      window.location.href = '/index.html';
    },
    
    // Update UI based on auth state
    updateUIState() {
      const navAuthContainer = document.getElementById('navAuth');
      if (!navAuthContainer) return;
      
      if (this.isLoggedIn()) {
        const user = this.getUser();
        const role = user.role || 'client';
        
        // Hide cart for admins and superadmins
        const cartItem = document.querySelector('.cart-item');
        if (cartItem) {
          if (role === 'admin' || role === 'superadmin') {
            cartItem.style.display = 'none';
          } else {
            cartItem.style.display = '';
          }
        }
        
        // Hide About and Contact for admins and superadmins
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if ((role === 'admin' || role === 'superadmin') && 
              (href === 'about.html' || href === 'contact.html')) {
            link.parentElement.style.display = 'none';
          }
        });
        
        let menuItems = `
          <li><a class="dropdown-item" href="/products.html">Products</a></li>
        `;
        
        // Only clients can see cart
        if (role === 'client') {
          menuItems += `<li><a class="dropdown-item" href="/cart.html">My Cart</a></li>`;
        }
        
        // Admin and Superadmin menu items
        if (role === 'admin' || role === 'superadmin') {
          menuItems += `
            <li><hr class="dropdown-divider"></li>
            <li><h6 class="dropdown-header">Admin Panel</h6></li>
            <li><a class="dropdown-item" href="/admin/products.html">Manage Products</a></li>
            <li><a class="dropdown-item" href="/admin/orders.html">Manage Orders</a></li>
          `;
        }
        
        // Superadmin only menu items
        if (role === 'superadmin') {
          menuItems += `
            <li><a class="dropdown-item" href="/admin/users.html">Manage Users</a></li>
          `;
        }
        
        menuItems += `
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
        `;
        
        const roleBadge = role === 'superadmin' ? '[SA]' : role === 'admin' ? '[A]' : '[U]';
        
        // Add dropdown class to parent li
        navAuthContainer.classList.add('dropdown');
        
        navAuthContainer.innerHTML = `
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
             data-bs-toggle="dropdown" aria-expanded="false">
            ${roleBadge} ${user.name || user.email}
          </a>
          <ul class="dropdown-menu" aria-labelledby="userDropdown">
            ${menuItems}
          </ul>
        `;
        
        // Add logout handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
      } else {
        // Remove dropdown class when logged out
        navAuthContainer.classList.remove('dropdown');
        navAuthContainer.innerHTML = `
          <a class="nav-link" href="/login.html">Login</a>
        `;
      }
    },
    
    // Make authenticated API request
    async request(url, options = {}) {
      const token = this.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      try {
        const response = await fetch(url, {
          ...options,
          headers
        });
        
        // If unauthorized, logout
        if (response.status === 401) {
          this.logout();
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    }
  };
  
  // Make Auth available globally
  window.Auth = Auth;
  
  // Initialize auth state on page load
  document.addEventListener('DOMContentLoaded', () => {
    Auth.updateUIState();
  });
  
  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Auth.saveAuth(data.data.token, data.data.user);
          showAlert('Login successful! Redirecting...', 'success');
          
          setTimeout(() => {
            // All users go to products page
            window.location.href = '/products.html';
          }, 1000);
        } else {
          showAlert(data.error?.message || 'Login failed', 'danger');
        }
      } catch (error) {
        showAlert('Network error: ' + error.message, 'danger');
      }
    });
  }
  
  // Register Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      
      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Auth.saveAuth(data.data.token, data.data.user);
          showAlert('Registration successful! Redirecting...', 'success');
          
          setTimeout(() => {
            // All users go to products page
            window.location.href = '/products.html';
          }, 1000);
        } else {
          showAlert(data.error?.message || 'Registration failed', 'danger');
        }
      } catch (error) {
        showAlert('Network error: ' + error.message, 'danger');
      }
    });
  }
  
  // Helper function to show alerts
  function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }, 5000);
  }
  
})();
