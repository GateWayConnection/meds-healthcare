
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Appointment {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: {
    _id: string;
    name: string;
  };
  specialtyId: {
    _id: string;
    name: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserAppointments();
      setUserAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      setError(null);
      const updatedAppointment = await apiService.updateAppointment(id, { status });
      setAppointments(prev => prev.map(a => a._id === id ? updatedAppointment : a));
      setUserAppointments(prev => prev.map(a => a._id === id ? updatedAppointment : a));
      return updatedAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
      throw err;
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      setError(null);
      const newAppointment = await apiService.createAppointment(appointmentData);
      return newAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    userAppointments,
    loading,
    error,
    updateAppointmentStatus,
    createAppointment,
    fetchUserAppointments,
    refetch: fetchAppointments
  };
};
