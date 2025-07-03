
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Stethoscope } from 'lucide-react';
import { useSpecialties } from '../../hooks/useSpecialties';
import { toast } from 'sonner';

const SpecialtyManager = () => {
  const { specialties, loading, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialties(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'stethoscope'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty._id, formData);
        toast.success('Specialty updated successfully');
      } else {
        await createSpecialty(formData);
        toast.success('Specialty created successfully');
      }
      setIsFormOpen(false);
      setEditingSpecialty(null);
      setFormData({ name: '', description: '', icon: 'stethoscope' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (specialty: any) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name,
      description: specialty.description,
      icon: specialty.icon
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this specialty?')) {
      try {
        await deleteSpecialty(id);
        toast.success('Specialty deleted successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete specialty');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Specialty Management</h1>
            <p className="text-gray-600">Manage medical specialties and departments</p>
          </motion.div>

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-rose-600" />
                  All Specialties ({specialties.length})
                </CardTitle>
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Specialty
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isFormOpen && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingSpecialty ? 'Edit Specialty' : 'Add New Specialty'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Cardiology"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief description of the specialty"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Icon</label>
                      <Input
                        value={formData.icon}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        placeholder="e.g., stethoscope, heart"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                        {editingSpecialty ? 'Update' : 'Create'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsFormOpen(false);
                          setEditingSpecialty(null);
                          setFormData({ name: '', description: '', icon: 'stethoscope' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {specialties.map((specialty, index) => (
                  <motion.div
                    key={specialty._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{specialty.name}</h3>
                        <Badge className={specialty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {specialty.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{specialty.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Icon: {specialty.icon}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(specialty)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(specialty._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SpecialtyManager;
