// Central API base URL configuration
// Automatically switches between local development and production deployment

const isDevelopment = process.env.NODE_ENV === 'development';

export const USER_LEARNING_API_BASE_URL = isDevelopment 
  ? "http://localhost:8081"  // Local development
  : "/api";                  // Production (proxied by Nginx)

export const EVALUATION_API_BASE_URL = isDevelopment 
  ? "http://localhost:8082/api"  // Local development
  : "/api/evaluation";           // Production (proxied by Nginx)

//export const EVALUATION_API_BASE_URL = "/api";


// For production, use:
//export const API_BASE_URL = "http://74.225.176.36:8081"; 