
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourses } from '../../hooks/useCourses';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '@/components/ui/use-toast';

const CourseManager = () => {
  const { courses, loading, createCourse, updateCourse, deleteCourse, fetchAllCourses } = useCourses();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
    image: '',
    videoUrl: '',
    videoTitle: '',
    isActive: true
  });

  React.useEffect(() => {
    fetchAllCourses();
  }, []);

  const { categories } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateCourse(editingCourse._id, formData);
        toast({
          title: "Success",
          description: "Health guide updated successfully!",
        });
      } else {
        await createCourse(formData);
        toast({
          title: "Success", 
          description: "Health guide created successfully!",
        });
      }
      
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      summary: course.summary,
      content: course.content,
      categoryId: course.categoryId?._id || course.categoryId || '',
      image: course.image,
      videoUrl: course.videoUrl,
      videoTitle: course.videoTitle,
      isActive: course.isActive
    });
    setEditingCourse(course);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this health guide?')) {
      try {
        await deleteCourse(id);
        toast({
          title: "Success",
          description: "Health guide deleted successfully!",
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
      summary: '',
      content: '',
      categoryId: '',
      image: '',
      videoUrl: '',
      videoTitle: '',
      isActive: true
    });
    setIsEditing(false);
    setEditingCourse(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health guides...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Health Education Guides</h1>
              <p className="text-gray-600 mt-2">Manage educational content for patients and families</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Guide
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? 'Edit Health Guide' : 'Create New Health Guide'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Guide Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g., How to Prevent Malaria"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Short Summary</Label>
                      <Textarea
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData({...formData, summary: e.target.value})}
                        placeholder="Brief, friendly description of what patients will learn"
                        maxLength={300}
                        required
                      />
                      <p className="text-sm text-gray-500">{formData.summary.length}/300 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Guide Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Write practical, easy-to-understand health tips. Use simple language and bullet points."
                        rows={8}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="Link to relevant illustration or photo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                        <Input
                          id="videoUrl"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                          placeholder="YouTube or educational video link"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoTitle">Video Title (Optional)</Label>
                      <Input
                        id="videoTitle"
                        value={formData.videoTitle}
                        onChange={(e) => setFormData({...formData, videoTitle: e.target.value})}
                        placeholder="e.g., WHO: Preventing Malaria"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                      />
                      <Label htmlFor="isActive">Make guide visible to patients</Label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit">
                        {isEditing ? 'Update Guide' : 'Create Guide'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={course.image || '/placeholder.svg'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {course.categoryId?.name || course.category}
                      </Badge>
                      <Badge variant={course.isActive ? 'default' : 'destructive'}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{course.summary}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {course.views} views
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(course)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(course._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No health guides created yet.</p>
              <p className="text-gray-500 mt-2">Create your first patient education guide to get started.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseManager;
