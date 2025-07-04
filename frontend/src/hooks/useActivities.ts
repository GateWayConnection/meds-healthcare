
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  type: 'user_registration' | 'doctor_registration' | 'appointment_booking' | 'system_update' | 'other';
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Partial<Activity>) => {
    try {
      setError(null);
      const newActivity = await apiService.createActivity(activityData);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      throw err;
    }
  };

  const updateActivity = async (id: string, activityData: Partial<Activity>) => {
    try {
      setError(null);
      const updatedActivity = await apiService.updateActivity(id, activityData);
      setActivities(prev => prev.map(a => a._id === id ? updatedActivity : a));
      return updatedActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity');
      throw err;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteActivity(id);
      setActivities(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      throw err;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities
  };
};
