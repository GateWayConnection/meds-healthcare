
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  verified?: boolean;
  specialty?: string;
  licenseNumber?: string;
  experience?: number;
  dateOfBirth?: string;
  bio?: string;
  avatar?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role?: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from localStorage and validate with backend
   */
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        // Validate token with backend
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.warn('Token validation failed:', error);
          // Clear invalid session data
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with email/phone and password
   * @param identifier - Email or South Sudan phone number
   * @param password - User password
   * @param role - Optional role filter
   */
  const login = async (identifier: string, password: string, role?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await apiService.login({
        identifier: identifier.trim(),
        password,
        role
      });

      if (response.success) {
        setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to let components handle the error message
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   * @param userData - User registration data
   */
  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await apiService.register(userData);

      if (response.success) {
        // For doctors, they won't be automatically logged in due to verification requirement
        if (userData.role === 'doctor') {
          return true; // Registration successful but not logged in
        }
        
        // For patients, set user session
        setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw to let components handle the error message
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  /**
   * Get updated user profile from backend
   */
  const refreshUserProfile = async (): Promise<void> => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user && !loading,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
