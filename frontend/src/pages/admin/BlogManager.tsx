
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Search, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { toast } from 'sonner';

const BlogManager = () => {
  const { blogs, loading, createBlog, updateBlog, deleteBlog, fetchAllBlogs } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    readTime: '5 min read'
  });

  React.useEffect(() => {
    fetchAllBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, blogData);
        toast.success('Blog updated successfully');
        setEditingBlog(null);
      } else {
        await createBlog(blogData);
        toast.success('Blog created successfully');
        setIsCreateModalOpen(false);
      }
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save blog');
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(', '),
      image: blog.image,
      readTime: blog.readTime
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id);
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete blog');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      image: '',
      readTime: '5 min read'
    });
    setEditingBlog(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading blogs...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Management</h1>
            <p className="text-gray-600">Manage blog posts and articles</p>
          </motion.div>

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center mb-4 md:mb-0">
                  <FileText className="w-5 h-5 mr-2 text-rose-600" />
                  All Blog Posts ({filteredBlogs.length})
                </CardTitle>
                <Button 
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    resetForm();
                    setIsCreateModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{blog.title}</h3>
                        <p className="text-sm text-gray-600">By {blog.author}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{blog.category}</Badge>
                          <span className="text-sm text-gray-500">{blog.readTime}</span>
                          <span className="text-sm text-gray-500">{blog.views} views</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isCreateModalOpen && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Brief description of the blog post"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your blog content here..."
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g., Health Tips, Medical News"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Read Time
                      </label>
                      <Input
                        value={formData.readTime}
                        onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="health, wellness, tips"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                      {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogManager;
