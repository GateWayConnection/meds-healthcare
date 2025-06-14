
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => boolean;
  register: (userData: any) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password && u.role === role
    );
    
    if (foundUser) {
      const userSession = { ...foundUser };
      delete userSession.password;
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const register = (userData: any): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === userData.email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      verified: userData.role === 'patient' ? true : false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
