
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PatientProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would normally save to the backend
    console.log('Saving profile data:', formData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-rose-600" />
                  Personal Information
                </CardTitle>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {formData.name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {formData.email || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {formData.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {formData.address || 'Not provided'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;
