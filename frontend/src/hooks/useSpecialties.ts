
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Specialty {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use public endpoint instead of admin-only endpoint
      const data = await apiService.getSpecialties();
      
      setSpecialties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch specialties');
    } finally {
      setLoading(false);
    }
  };

  const createSpecialty = async (specialtyData: Partial<Specialty>) => {
    try {
      setError(null);
      const newSpecialty = await apiService.createSpecialty(specialtyData);
      setSpecialties(prev => [...prev, newSpecialty]);
      return newSpecialty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create specialty');
      throw err;
    }
  };

  const updateSpecialty = async (id: string, specialtyData: Partial<Specialty>) => {
    try {
      setError(null);
      const updatedSpecialty = await apiService.updateSpecialty(id, specialtyData);
      setSpecialties(prev => prev.map(s => s._id === id ? updatedSpecialty : s));
      return updatedSpecialty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update specialty');
      throw err;
    }
  };

  const deleteSpecialty = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteSpecialty(id);
      setSpecialties(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete specialty');
      throw err;
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  return {
    specialties,
    loading,
    error,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    refetch: fetchSpecialties
  };
};
