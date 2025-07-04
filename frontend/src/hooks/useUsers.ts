
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  verified: boolean;
  isActive: boolean;
  createdAt: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      setError(null);
      const newUser = await apiService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await apiService.updateUser(id, userData);
      setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  };
};
