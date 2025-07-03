
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { useSpecialties } from '../../hooks/useSpecialties';
import { toast } from 'sonner';

const DoctorManager = () => {
  const { doctors, loading, createDoctor, updateDoctor, deleteDoctor } = useDoctors(undefined, true);
  const { specialties } = useSpecialties();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialtyId: '',
    experience: '',
    rating: '4.5',
    consultationFee: '',
    qualifications: '',
    image: '/placeholder.svg'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doctorData = {
        ...formData,
        experience: parseInt(formData.experience),
        rating: parseFloat(formData.rating),
        consultationFee: parseInt(formData.consultationFee),
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q)
      };

      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, doctorData);
        toast.success('Doctor updated successfully');
      } else {
        await createDoctor(doctorData);
        toast.success('Doctor created successfully');
      }
      setIsFormOpen(false);
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        specialtyId: '',
        experience: '',
        rating: '4.5',
        consultationFee: '',
        qualifications: '',
        image: '/placeholder.svg'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialtyId: doctor.specialtyId._id,
      experience: doctor.experience.toString(),
      rating: doctor.rating.toString(),
      consultationFee: doctor.consultationFee.toString(),
      qualifications: doctor.qualifications.join(', '),
      image: doctor.image
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        toast.success('Doctor deleted successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete doctor');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Doctor Management</h1>
            <p className="text-gray-600">Manage doctors and their information</p>
          </motion.div>

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-rose-600" />
                  All Doctors ({doctors.length})
                </CardTitle>
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isFormOpen && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                  </h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Dr. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="doctor@hospital.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Specialty</label>
                      <Select
                        value={formData.specialtyId}
                        onValueChange={(value) => setFormData({...formData, specialtyId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty._id} value={specialty._id}>
                              {specialty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Experience (years)</label>
                      <Input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: e.target.value})}
                        placeholder="4.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                      <Input
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                        placeholder="50"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Qualifications (comma separated)</label>
                      <Input
                        value={formData.qualifications}
                        onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                        placeholder="MBBS, MD, Fellowship in Cardiology"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="/placeholder.svg"
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-2">
                      <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                        {editingDoctor ? 'Update' : 'Create'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsFormOpen(false);
                          setEditingDoctor(null);
                          setFormData({
                            name: '',
                            email: '',
                            specialtyId: '',
                            experience: '',
                            rating: '4.5',
                            consultationFee: '',
                            qualifications: '',
                            image: '/placeholder.svg'
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                          <Badge className={doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {doctor.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialtyId.name}</p>
                        <p className="text-sm text-gray-500">
                          {doctor.experience} years • Rating: {doctor.rating} • Fee: ${doctor.consultationFee}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(doctor._id)}
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

export default DoctorManager;
