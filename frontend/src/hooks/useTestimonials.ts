
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Testimonial {
  _id: string;
  patientName: string;
  patientEmail: string;
  content: string;
  rating: number;
  treatment: string;
  avatar: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      setError(null);
      const newTestimonial = await apiService.createTestimonial(testimonialData);
      return newTestimonial;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial');
      throw err;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    createTestimonial,
    refetch: fetchTestimonials
  };
};
