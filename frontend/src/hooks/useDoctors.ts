
import { useState, useEffect } from 'react';
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

  const fetchDoctors = async (specialty?: string) => {
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
  };

  const fetchAllDoctors = async () => {
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
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };
    
    loadDoctors();
  }, []);

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
