import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface DoctorProfile {
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

interface DoctorReports {
  doctorInfo: {
    name: string;
    specialty: string;
    consultationFee: number;
  };
  summary: {
    totalAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    pendingAppointments: number;
    thisMonthTotal: number;
    estimatedRevenue: number;
  };
  recentAppointments: any[];
  generatedAt: string;
}

export const useDoctorProfile = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [reports, setReports] = useState<DoctorReports | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDoctorProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<DoctorProfile>) => {
    try {
      setError(null);
      const updatedProfile = await apiService.updateDoctorProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const generateReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDoctorReports();
      setReports(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reports');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    reports,
    loading,
    error,
    updateProfile,
    generateReports,
    refetch: fetchProfile
  };
};