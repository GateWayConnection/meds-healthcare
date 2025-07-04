
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      setError(null);
      const newCategory = await apiService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      setError(null);
      const updatedCategory = await apiService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(c => c._id === id ? updatedCategory : c));
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
