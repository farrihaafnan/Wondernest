// Central API base URL configuration
// Automatically switches between local development and production deployment

const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? "http://localhost:8081"  // Local development
  : "/api";                  // Production (proxied by Nginx)


// For production, use:
//export const API_BASE_URL = "http://74.225.176.36:8081"; 