import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Stats {
  _id: string;
  expertDoctors: number;
  happyPatients: number;
  medicalDepartments: number;
  emergencySupport: string;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (newStats: Partial<Stats>) => {
    try {
      const updated = await apiService.updateStats(newStats);
      setStats(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    updateStats
  };
};