
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  videoUrl: string;
  price: number;
  isActive: boolean;
  enrollments: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    try {
      setError(null);
      const newCourse = await apiService.createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      throw err;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      setError(null);
      const updatedCourse = await apiService.updateCourse(id, courseData);
      setCourses(prev => prev.map(c => c._id === id ? updatedCourse : c));
      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses,
    fetchAllCourses
  };
};
