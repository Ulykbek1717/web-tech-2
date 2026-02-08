(function() {
  const API_BASE = '/api';
  
  const Auth = {
    // Save token and user to localStorage
    saveAuth(token, user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      this.updateUIState();
    },
    
    getToken() {
      return localStorage.getItem('authToken');
    },
    
    getUser() {
      const userStr = localStorage.getItem('authUser');
      return userStr ? JSON.parse(userStr) : null;
    },
    
    isLoggedIn() {
      return !!this.getToken();
    },
    
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      this.updateUIState();
      window.location.href = '/index.html';
    },
    
    // Update navbar based on user role
    updateUIState() {
      const navAuthContainer = document.getElementById('navAuth');
      if (!navAuthContainer) return;
      
      if (this.isLoggedIn()) {
        const user = this.getUser();
        const role = user.role || 'client';
        
        // Hide cart for admin/superadmin
        const cartItem = document.querySelector('.cart-item');
        if (cartItem) {
          if (role === 'admin' || role === 'superadmin') {
            cartItem.style.display = 'none';
          } else {
            cartItem.style.display = '';
          }
        }
        
        // Hide About/Contact for admin/superadmin
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
        
        if (role === 'client') {
          menuItems += `<li><a class="dropdown-item" href="/cart.html">My Cart</a></li>`;
        }
        
        if (role === 'admin' || role === 'superadmin') {
          menuItems += `
            <li><hr class="dropdown-divider"></li>
            <li><h6 class="dropdown-header">Admin Panel</h6></li>
            <li><a class="dropdown-item" href="/admin/products.html">Manage Products</a></li>
            <li><a class="dropdown-item" href="/admin/orders.html">Manage Orders</a></li>
          `;
        }
        
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
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
      } else {
        navAuthContainer.classList.remove('dropdown');
        navAuthContainer.innerHTML = `
          <a class="nav-link" href="/login.html">Login</a>
        `;
      }
    },
    
    // Make authenticated request with token
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
        
        // Auto logout on 401
        if (response.status === 401) {
          this.logout();
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    }
  };
  
  window.Auth = Auth;
  
  document.addEventListener('DOMContentLoaded', () => {
    Auth.updateUIState();
  });
  
  // Login handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';
      
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
            window.location.href = '/products.html';
          }, 1000);
        } else {
          // Handle unverified users
          if (response.status === 403) {
            showAlert((data.error?.message || 'Please verify your email'), 'warning');
            
            const alertContainer = document.getElementById('alertContainer');
            const resendLink = document.createElement('button');
            resendLink.className = 'btn btn-sm btn-link';
            resendLink.textContent = 'Resend code';
            resendLink.onclick = async () => {
              try {
                const res = await fetch(`${API_BASE}/auth/resend-code`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                const resData = await res.json();
                if (res.ok) {
                  sessionStorage.setItem('verificationEmail', email);
                  window.location.href = `/verify.html?email=${encodeURIComponent(email)}`;
                } else {
                  showAlert(resData.error?.message || 'Error sending code', 'danger');
                }
              } catch (err) {
                showAlert('Network error', 'danger');
              }
            };
            alertContainer.querySelector('.alert').appendChild(resendLink);
          } else {
            showAlert(data.error?.message || 'Login error', 'danger');
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (error) {
        showAlert('Network error: ' + error.message, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
  
  // Register handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registering...';
      
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
          // Save email for verification page
          sessionStorage.setItem('verificationEmail', email);
          
          showAlert('Registration successful! Check your email for verification code.', 'success');
          
          setTimeout(() => {
            window.location.href = `/verify.html?email=${encodeURIComponent(email)}`;
          }, 1500);
        } else {
          showAlert(data.error?.message || 'Registration error', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (error) {
        showAlert('Network error: ' + error.message, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
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
