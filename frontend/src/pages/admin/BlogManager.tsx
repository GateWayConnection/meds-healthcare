
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Eye, Heart } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogManager = () => {
  const { blogs, loading, createBlog, updateBlog, deleteBlog, fetchAllBlogs, fetchMyBlogs } = useBlogs();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    readTime: '5 min read'
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllBlogs();
    } else {
      fetchMyBlogs();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, blogData);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        await createBlog(blogData);
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (blog) => {
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
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id);
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600 mt-2">
                  {user?.role === 'admin' ? 'Manage all blog posts' : 'Manage your blog posts'}
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        placeholder="Brief description of the post..."
                        required
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Write your blog post content here..."
                        required
                        rows={8}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="e.g., Wellness, Mental Health"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="readTime">Read Time</Label>
                        <Input
                          id="readTime"
                          value={formData.readTime}
                          onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                          placeholder="e.g., 5 min read"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="health, wellness, tips"
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Featured Image URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {editingBlog ? 'Update Post' : 'Create Post'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{blog.category}</Badge>
                          <div className="text-sm text-gray-500">
                            {blog.readTime}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
                        
                        <div className="text-sm text-gray-600">
                          <div>By: {blog.author}</div>
                          <div>Published: {new Date(blog.createdAt).toLocaleDateString()}</div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {blog.views}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {blog.likes}
                          </div>
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(blog)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(blog._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {blogs.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No blog posts found</p>
                <p className="text-gray-500">Create your first blog post to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogManager;
