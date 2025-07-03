
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import { useToast } from '@/hooks/use-toast';

const CourseManager = () => {
  const { courses, loading, createCourse, updateCourse, deleteCourse, fetchAllCourses } = useCourses();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    category: '',
    image: '',
    videoUrl: '',
    price: 0
  });

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, formData);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        await createCourse(formData);
        toast({
          title: "Success",
          description: "Course created successfully",
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

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      category: course.category,
      image: course.image,
      videoUrl: course.videoUrl || '',
      price: course.price
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        toast({
          title: "Success",
          description: "Course deleted successfully",
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
      description: '',
      instructor: '',
      duration: '',
      level: 'Beginner',
      category: '',
      image: '',
      videoUrl: '',
      price: 0
    });
    setEditingCourse(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-2">Manage educational courses and programs</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                          id="instructor"
                          value={formData.instructor}
                          onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="e.g., 4 weeks"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g., Cardiology, General Health"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                      <Input
                        id="videoUrl"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {editingCourse ? 'Update Course' : 'Create Course'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{course.category}</Badge>
                          <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                            {course.level}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                        
                        <div className="text-sm text-gray-600">
                          <div>Instructor: {course.instructor}</div>
                          <div>Duration: {course.duration}</div>
                          <div>Price: {course.price === 0 ? 'Free' : `$${course.price}`}</div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(course)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(course._id)}
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

            {courses.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No courses found</p>
                <p className="text-gray-500">Create your first course to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseManager;
