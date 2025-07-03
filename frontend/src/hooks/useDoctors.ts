
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  licenseNumber: string;
  bio: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
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
  };

  const createDoctor = async (doctorData: Partial<Doctor>) => {
    try {
      setError(null);
      const newDoctor = await apiService.createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      return newDoctor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor');
      throw err;
    }
  };

  const updateDoctor = async (id: string, doctorData: Partial<Doctor>) => {
    try {
      setError(null);
      const updatedDoctor = await apiService.updateDoctor(id, doctorData);
      setDoctors(prev => prev.map(d => d._id === id ? updatedDoctor : d));
      return updatedDoctor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update doctor');
      throw err;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
      throw err;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    refetch: fetchDoctors
  };
};
