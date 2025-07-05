
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
      console.log('📋 Fetching testimonials...');
      const data = await apiService.getTestimonials();
      console.log('📋 Fetched testimonials:', data);
      setTestimonials(data || []);
    } catch (err) {
      console.error('❌ Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      setError(null);
      console.log('✍️ Creating testimonial:', testimonialData);
      const newTestimonial = await apiService.createTestimonial(testimonialData);
      console.log('✅ Testimonial created:', newTestimonial);
      
      // Refresh testimonials after creating
      await fetchTestimonials();
      
      return newTestimonial;
    } catch (err) {
      console.error('❌ Error creating testimonial:', err);
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
