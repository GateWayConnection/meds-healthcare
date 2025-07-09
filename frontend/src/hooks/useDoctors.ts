import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialtyId: {
    _id: string;
    name: string;
    description: string;
  };
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  qualifications: string[];
  availability: object;
  consultationFee: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async (specialty?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDoctors(specialty);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDoctor = useCallback(async (doctorData: Partial<Doctor>) => {
    try {
      setError(null);
      const newDoctor = await apiService.createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      return newDoctor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor');
      throw err;
    }
  }, []);

  const updateDoctor = useCallback(async (id: string, doctorData: Partial<Doctor>) => {
    try {
      setError(null);
      const updatedDoctor = await apiService.updateDoctor(id, doctorData);
      setDoctors(prev => prev.map(d => d._id === id ? updatedDoctor : d));
      return updatedDoctor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update doctor');
      throw err;
    }
  }, []);

  const deleteDoctor = useCallback(async (id: string) => {
    try {
      setError(null);
      await apiService.deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDoctors(); // ✅ Initial fetch on mount (once)
  }, [fetchDoctors]);

  return {
    doctors,
    loading,
    error,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    fetchDoctors,
    fetchAllDoctors,
    refetch: fetchDoctors
  };
};
