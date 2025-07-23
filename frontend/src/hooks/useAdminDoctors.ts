import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AdminDoctor {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  consultationFee: number;
  isActive: boolean;
  isAvailable: boolean;
  createdAt: string;
  qualifications: string[];
}

export const useAdminDoctors = () => {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<AdminDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllDoctors();
      setDoctors(data);
      
      // Filter pending doctors (inactive ones)
      const pending = data.filter((doctor: AdminDoctor) => !doctor.isActive);
      setPendingDoctors(pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const verifyDoctor = async (doctorId: string) => {
    try {
      setError(null);
      await apiService.verifyDoctor(doctorId);
      
      // Update local state
      setDoctors(prev => prev.map(doctor => 
        doctor._id === doctorId 
          ? { ...doctor, isActive: true, isAvailable: true }
          : doctor
      ));
      setPendingDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify doctor');
      throw err;
    }
  };

  const unverifyDoctor = async (doctorId: string) => {
    try {
      setError(null);
      await apiService.unverifyDoctor(doctorId);
      
      // Update local state
      setDoctors(prev => prev.map(doctor => 
        doctor._id === doctorId 
          ? { ...doctor, isActive: false, isAvailable: false }
          : doctor
      ));
      setPendingDoctors(prev => [...prev, doctors.find(d => d._id === doctorId)!]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unverify doctor');
      throw err;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    pendingDoctors,
    loading,
    error,
    verifyDoctor,
    unverifyDoctor,
    refetch: fetchDoctors
  };
};