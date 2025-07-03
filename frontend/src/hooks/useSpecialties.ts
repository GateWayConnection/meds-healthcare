import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Specialty {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useSpecialties = (includeInactive = false) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = includeInactive 
        ? await apiService.getAllSpecialties()
        : await apiService.getSpecialties();
      setSpecialties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch specialties');
    } finally {
      setLoading(false);
    }
  };

  const createSpecialty = async (specialtyData: Omit<Specialty, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    try {
      const newSpecialty = await apiService.createSpecialty(specialtyData);
      setSpecialties(prev => [...prev, newSpecialty]);
      return newSpecialty;
    } catch (err) {
      throw err;
    }
  };

  const updateSpecialty = async (id: string, updates: Partial<Specialty>) => {
    try {
      const updated = await apiService.updateSpecialty(id, updates);
      setSpecialties(prev => prev.map(s => s._id === id ? updated : s));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteSpecialty = async (id: string) => {
    try {
      await apiService.deleteSpecialty(id);
      setSpecialties(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, [includeInactive]);

  return {
    specialties,
    loading,
    error,
    refetch: fetchSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
  };
};