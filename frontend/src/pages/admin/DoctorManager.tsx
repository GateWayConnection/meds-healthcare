
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Search, Users, UserPlus, Edit, Trash2, Stethoscope } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { useSpecialties } from '../../hooks/useSpecialties';
import { toast } from 'sonner';

const DoctorManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialtyId: '',
    experience: '',
    rating: '',
    image: '',
    qualifications: '',
    consultationFee: '',
    isAvailable: true,
    isActive: true
  });

  const { doctors, loading, createDoctor, updateDoctor, deleteDoctor, refetch } = useDoctors();
  const { specialties } = useSpecialties();

  const filteredDoctors = doctors.filter((doctor: any) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !filterSpecialty || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doctorData = {
        ...formData,
        experience: parseInt(formData.experience),
        rating: parseFloat(formData.rating),
        consultationFee: parseFloat(formData.consultationFee),
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q)
      };

      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, doctorData);
        toast.success('Doctor updated successfully');
      } else {
        await createDoctor(doctorData);
        toast.success('Doctor created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialtyId: doctor.specialtyId._id || doctor.specialtyId,
      experience: doctor.experience.toString(),
      rating: doctor.rating.toString(),
      image: doctor.image || '',
      qualifications: doctor.qualifications ? doctor.qualifications.join(', ') : '',
      consultationFee: doctor.consultationFee.toString(),
      isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
      isActive: doctor.isActive !== undefined ? doctor.isActive : true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        toast.success('Doctor deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete doctor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialtyId: '',
      experience: '',
      rating: '',
      image: '',
      qualifications: '',
      consultationFee: '',
      isAvailable: true,
      isActive: true
    });
    setEditingDoctor(null);
  };

  const getStatusColor = (doctor: any) => {
    if (!doctor.isActive) return 'bg-gray-100 text-gray-800';
    if (!doctor.isAvailable) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (doctor: any) => {
    if (!doctor.isActive) return 'Inactive';
    if (!doctor.isAvailable) return 'Unavailable';
    return 'Available';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
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
            <p className="text-gray-600">Manage doctors and their availability</p>
          </motion.div>

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center mb-4 md:mb-0">
                  <Stethoscope className="w-5 h-5 mr-2 text-rose-600" />
                  All Doctors ({filteredDoctors.length})
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={resetForm}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="specialty">Specialty *</Label>
                          <Select value={formData.specialtyId} onValueChange={(value) => setFormData({...formData, specialtyId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {specialties.map((specialty: any) => (
                                <SelectItem key={specialty._id} value={specialty._id}>
                                  {specialty.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rating">Rating (1-5)</Label>
                          <Input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="consultationFee">Consultation Fee ($) *</Label>
                          <Input
                            id="consultationFee"
                            type="number"
                            step="0.01"
                            value={formData.consultationFee}
                            onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="/placeholder.svg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                        <Textarea
                          id="qualifications"
                          value={formData.qualifications}
                          onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                          placeholder="MD, MBBS, Specialist in..."
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})}
                          />
                          <Label htmlFor="isAvailable">Available for appointments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                          />
                          <Label htmlFor="isActive">Active profile</Label>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button type="submit" className="flex-1">
                          {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specialties</SelectItem>
                    {specialties.map((specialty: any) => (
                      <SelectItem key={specialty._id} value={specialty.name}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredDoctors.map((doctor: any, index: number) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center overflow-hidden">
                        {doctor.image ? (
                          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-rose-600 font-semibold">
                            {doctor.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.email}</p>
                        <p className="text-sm text-blue-600">{doctor.specialty} • {doctor.experience} years</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">${doctor.consultationFee}</p>
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                      </div>
                      <Badge className={getStatusColor(doctor)}>
                        {getStatusText(doctor)}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(doctor)}>
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
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No doctors found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorManager;
