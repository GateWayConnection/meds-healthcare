
import { useState, useEffect } from 'react';

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
      const response = await fetch('/api/testimonials');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: { content: string; rating: number; treatment?: string }) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testimonialData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create testimonial');
      }
      
      const newTestimonial = await response.json();
      await fetchTestimonials(); // Refresh the list
      return newTestimonial;
    } catch (err) {
      console.error('Error creating testimonial:', err);
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
