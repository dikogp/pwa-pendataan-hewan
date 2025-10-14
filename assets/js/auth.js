// Authentication Module
class Auth {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.isAuthenticated = true;
        console.log('User already logged in:', this.currentUser.email);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
      }
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Login function
  async login(email, password, rememberMe = false) {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Email dan password harus diisi');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Format email tidak valid');
      }

      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials or any valid email with password >= 6 chars
      const validCredentials = [
        { email: 'admin@pendataanhewan.com', password: 'admin123', name: 'Admin' },
        { email: 'demo@pendataanhewan.com', password: 'demo123', name: 'Demo User' },
        { email: 'user@test.com', password: 'password', name: 'Test User' }
      ];

      const user = validCredentials.find(cred => 
        cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      // If not found in predefined credentials, allow any valid email/password combination
      if (user || (email && password.length >= 6)) {
        this.currentUser = {
          id: Date.now(),
          email: email.toLowerCase(),
          name: user ? user.name : email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
          loginTime: new Date().toISOString(),
          type: 'email'
        };
        
        this.isAuthenticated = true;
        
        // Save user session
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        console.log('Login successful:', this.currentUser.email);
        return true;
      }
      
      throw new Error('Email atau password salah');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Register function
  async register(userData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple validation
      if (userData.email && userData.password && userData.name) {
        // In real app, you'd send this to your backend
        console.log('User registered:', userData.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  // Google login simulation
  async loginWithGoogle() {
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.currentUser = {
        id: Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        loginTime: new Date().toISOString(),
        type: 'google',
        photo: 'https://via.placeholder.com/100'
      };
      
      this.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  }

  // Guest login
  loginAsGuest() {
    this.currentUser = {
      id: 'guest',
      email: 'guest@local',
      name: 'Guest User',
      loginTime: new Date().toISOString(),
      type: 'guest'
    };
    
    this.isAuthenticated = true;
    sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  // Logout function
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  // Require authentication - redirect if not logged in
  requireAuth() {
    if (!this.isLoggedIn()) {
      // Redirect to login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('login.html') && !currentPath.includes('index.html')) {
        window.location.href = currentPath.includes('/pages/') ? 'login.html' : 'pages/login.html';
        return false;
      }
    }
    return true;
  }

  // Update user profile
  updateUserProfile(profileData) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  // Update user data
  updateUser(userData) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, verify current password and update
      console.log('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

// Create global auth instance
const auth = new Auth();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}