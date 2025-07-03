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
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  consultationFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useDoctors = (specialty?: string, includeInactive = false) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = includeInactive 
        ? await apiService.getAllDoctors()
        : await apiService.getDoctors(specialty);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (doctorData: any) => {
    try {
      const newDoctor = await apiService.createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      return newDoctor;
    } catch (err) {
      throw err;
    }
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    try {
      const updated = await apiService.updateDoctor(id, updates);
      setDoctors(prev => prev.map(d => d._id === id ? updated : d));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await apiService.deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, includeInactive]);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
  };
};