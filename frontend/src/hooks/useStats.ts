
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Stats {
  expertDoctors: number;
  happyPatients: number;
  medicalDepartments: number;
  emergencySupport: string;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
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

  const updateStats = async (statsData: Partial<Stats>) => {
    try {
      setError(null);
      const updatedStats = await apiService.updateStats(statsData);
      setStats(updatedStats);
      return updatedStats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stats');
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
    updateStats,
    refetch: fetchStats
  };
};
