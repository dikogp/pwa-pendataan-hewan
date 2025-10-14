// Error Handler Module
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      // Skip errors from browser extensions and their scripts
      if (event.filename && (
          event.filename.includes('chrome-extension://') ||
          event.filename.includes('moz-extension://') ||
          event.filename.includes('safari-extension://') ||
          event.filename.includes('extension://') ||
          event.filename.includes('content/counter.js') ||
          event.filename.includes('adblock/') ||
          event.filename.includes('FingerPrint.js') ||
          event.filename.includes('Ex.js')
      )) {
        return;
      }

      // Skip extension-related error messages
      if (event.message && (
          event.message.includes('chrome-extension://') ||
          event.message.includes('Extension') ||
          event.message.includes('adblock') ||
          event.message.includes('FingerPrint') ||
          event.message.includes('all_funcdisable')
      )) {
        return;
      }

      this.handleError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      // Skip extension-related promise rejections
      if (event.reason && (
          (typeof event.reason === 'string' && (
            event.reason.includes('chrome-extension://') ||
            event.reason.includes('Extension') ||
            event.reason.includes('adblock') ||
            event.reason.includes('FingerPrint')
          )) ||
          (event.reason && event.reason.stack && 
            event.reason.stack.includes('chrome-extension://'))
      )) {
        return;
      }

      this.handleError({
        message: 'Unhandled Promise Rejection: ' + event.reason,
        type: 'promise'
      });
    });
  }

  handleError(errorInfo) {
    // Extended extension error filtering
    if (errorInfo.message && (
        errorInfo.message.includes('chrome-extension://') ||
        errorInfo.message.includes('Extension') ||
        errorInfo.message.includes('adblock') ||
        errorInfo.message.includes('FingerPrint') ||
        errorInfo.message.includes('all_funcdisable') ||
        errorInfo.message.includes('Ex.js') ||
        errorInfo.message.includes('counter.js') ||
        errorInfo.message.includes('Cannot read properties of undefined') && 
        errorInfo.filename && errorInfo.filename.includes('chrome-extension://')
    )) {
      // Silently ignore extension errors
      return;
    }
    
    console.error('Error caught by handler:', errorInfo);
    
    // Log to localStorage for debugging
    this.logError(errorInfo);
  }

  logError(errorInfo) {
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push({
        timestamp: new Date().toISOString(),
        ...errorInfo
      });
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }
}

// Utility functions for showing messages
function showError(message) {
  console.error(message);
  
  // Try to show in UI if possible
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = `<div class="alert alert-error">${message}</div>`;
    setTimeout(() => {
      errorContainer.innerHTML = '';
    }, 5000);
  }
}

function showSuccess(message) {
  console.log('Success:', message);
  
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
    setTimeout(() => {
      errorContainer.innerHTML = '';
    }, 3000);
  }
}

function showInfo(message) {
  console.info(message);
  
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = `<div class="alert alert-info">${message}</div>`;
    setTimeout(() => {
      errorContainer.innerHTML = '';
    }, 3000);
  }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, showError, showSuccess, showInfo };
}