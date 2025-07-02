/**
 * API Service Layer for MEDS Healthcare Frontend
 * Handles all HTTP requests to the backend API
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * HTTP request wrapper with error handling
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get stored auth token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Set auth token in localStorage
   */
  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Remove auth token from localStorage
   */
  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  /**
   * Create request headers with optional authentication
   */
  private createHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Generic HTTP request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.createHeaders(includeAuth),
        ...options.headers,
      },
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          this.removeAuthToken();
          throw new Error(data.message || 'Authentication failed. Please login again.');
        }
        
        throw new Error(data.message || `HTTP ${response.status}: Request failed`);
      }

      console.log(`✅ API Response: ${config.method || 'GET'} ${url} - Success`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any, includeAuth: boolean = false): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      includeAuth
    );
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, includeAuth: boolean = false): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      includeAuth
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }

  // Authentication API methods

  /**
   * Register new user
   */
  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    dateOfBirth?: string;
    specialty?: string;
    licenseNumber?: string;
    experience?: number;
    bio?: string;
  }) {
    const response = await this.post('/auth/register', userData);
    
    // Store token and user data if registration is successful
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Login user with email/phone and password
   */
  async login(credentials: {
    identifier: string; // email or phone
    password: string;
    role?: string;
  }) {
    const response = await this.post('/auth/login', credentials);
    
    // Store token and user data if login is successful
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    return this.get('/auth/me', true);
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.post('/auth/logout', {}, true);
    } catch (error) {
      // Even if the API call fails, we should remove local tokens
      console.warn('Logout API call failed, but removing local tokens:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const response = await this.post('/auth/refresh', {}, true);
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = localStorage.getItem('currentUser');
    return !!(token && user);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;