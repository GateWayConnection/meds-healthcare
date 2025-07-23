import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, Stethoscope, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAdminDoctors } from '../../hooks/useAdminDoctors';
import { useSpecialties } from '../../hooks/useSpecialties';
import { toast } from 'sonner';

const DoctorManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { doctors, pendingDoctors, loading, error, verifyDoctor, unverifyDoctor, refetch } = useAdminDoctors();
  const { specialties } = useSpecialties();

  const filteredDoctors = doctors.filter((doctor: any) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !filterSpecialty || filterSpecialty === 'All' || doctor.specialty === filterSpecialty;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'verified' && doctor.isActive) ||
                          (filterStatus === 'pending' && !doctor.isActive);
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleVerifyDoctor = async (doctorId: string) => {
    try {
      await verifyDoctor(doctorId);
      toast.success('Doctor verified successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify doctor');
    }
  };

  const handleUnverifyDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to unverify this doctor? They will not be able to log in.')) {
      try {
        await unverifyDoctor(doctorId);
        toast.success('Doctor unverified successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to unverify doctor');
      }
    }
  };

  const getVerificationStatus = (doctor: any) => {
    if (!doctor.isActive) {
      return {
        text: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      };
    }
    return {
      text: 'Verified',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    };
  };

  const getAvailabilityStatus = (doctor: any) => {
    if (!doctor.isAvailable) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = (doctor: any) => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Doctor Verification Management</h1>
            <p className="text-gray-600">Manage doctor verification status and approve new registrations</p>
          </motion.div>

          {/* Pending Doctors Alert */}
          {pendingDoctors.length > 0 && (
            <Card className="shadow-lg mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-800">
                    {pendingDoctors.length} doctor{pendingDoctors.length !== 1 ? 's' : ''} awaiting verification
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-rose-600" />
                All Doctors ({filteredDoctors.length})
              </CardTitle>
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
                    <SelectItem value="All">All Specialties</SelectItem>
                    {specialties.map((specialty: any) => (
                      <SelectItem key={specialty._id} value={specialty.name}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
                        {doctor.qualifications && doctor.qualifications.length > 0 && (
                          <p className="text-xs text-gray-500">{doctor.qualifications.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">${doctor.consultationFee}</p>
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <Badge className={getVerificationStatus(doctor).color}>
                          {React.createElement(getVerificationStatus(doctor).icon, { className: "w-3 h-3 mr-1" })}
                          {getVerificationStatus(doctor).text}
                        </Badge>
                        <Badge className={getAvailabilityStatus(doctor)}>
                          {getAvailabilityText(doctor)}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        {!doctor.isActive ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => handleVerifyDoctor(doctor._id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-yellow-600 hover:text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                            onClick={() => handleUnverifyDoctor(doctor._id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        )}
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