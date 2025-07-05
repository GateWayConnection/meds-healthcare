
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingApprovals: number;
}

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialty?: string;
  licenseNumber?: string;
  verified: boolean;
  createdAt: string;
}

export const useDoctorDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, usersData] = await Promise.all([
        apiService.getStats(),
        apiService.getUsers()
      ]);
      
      setStats(statsData);
      
      // Filter users who are not verified (pending approval)
      const pending = usersData.filter((user: any) => !user.verified && user.isActive);
      setPendingUsers(pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      setError(null);
      await apiService.updateUser(userId, { verified: true });
      setPendingUsers(prev => prev.filter(user => user._id !== userId));
      
      // Refresh stats
      await fetchDashboardStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve user');
      throw err;
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    pendingUsers,
    loading,
    error,
    approveUser,
    refetch: fetchDashboardStats
  };
};
