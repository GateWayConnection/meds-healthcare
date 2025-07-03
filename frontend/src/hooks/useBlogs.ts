
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: {
    _id: string;
    name: string;
  };
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  isPublished: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMyBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData: Partial<Blog>) => {
    try {
      setError(null);
      const newBlog = await apiService.createBlog(blogData);
      setBlogs(prev => [newBlog, ...prev]);
      return newBlog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
      throw err;
    }
  };

  const updateBlog = async (id: string, blogData: Partial<Blog>) => {
    try {
      setError(null);
      const updatedBlog = await apiService.updateBlog(id, blogData);
      setBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
      return updatedBlog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
      throw err;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setError(null);
      await apiService.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
      throw err;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    refetch: fetchBlogs,
    fetchAllBlogs,
    fetchMyBlogs
  };
};
