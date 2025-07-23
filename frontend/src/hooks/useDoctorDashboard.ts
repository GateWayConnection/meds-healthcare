
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingApprovals: number;
}

interface PendingDoctor {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  isActive: boolean;
  createdAt: string;
}

export const useDoctorDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, doctorsData] = await Promise.all([
        apiService.getStats(),
        apiService.getAllDoctors()
      ]);
      
      setStats(statsData);
      
      // Filter doctors who are not active (pending approval)
      const pending = doctorsData.filter((doctor: any) => !doctor.isActive);
      setPendingDoctors(pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (doctorId: string) => {
    try {
      setError(null);
      await apiService.verifyDoctor(doctorId);
      setPendingDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
      
      // Refresh stats
      await fetchDashboardStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve doctor');
      throw err;
    }
  };

  const rejectDoctor = async (doctorId: string) => {
    try {
      setError(null);
      await apiService.unverifyDoctor(doctorId);
      
      // Refresh stats
      await fetchDashboardStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject doctor');
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    pendingDoctors,
    loading,
    error,
    approveDoctor,
    rejectDoctor,
    refetch: fetchDashboardStats
  };
};
