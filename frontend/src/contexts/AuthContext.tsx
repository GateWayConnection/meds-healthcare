
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
  login: (email: string, password: string) => Promise<boolean>;
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

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store both user and token
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Map phoneNumber to phone for API consistency
      const apiData = {
        ...userData,
        phone: userData.phoneNumber || userData.phone
      };
      
      // Remove phoneNumber if it exists to avoid confusion
      if (apiData.phoneNumber) {
        delete apiData.phoneNumber;
      }
      
      console.log('Sending registration data:', apiData);
      
      const response = await apiService.register(apiData);

      if (response.success && response.data) {
        // For patients, auto-login after registration
        if (userData.role === 'patient' && response.data.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          setUser(response.data.user);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Clear local storage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
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
