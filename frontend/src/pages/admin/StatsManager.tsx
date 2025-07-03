
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TrendingUp, Save } from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { toast } from 'sonner';

const StatsManager = () => {
  const { stats, loading, updateStats } = useStats();
  const [formData, setFormData] = useState({
    expertDoctors: stats?.expertDoctors || 0,
    happyPatients: stats?.happyPatients || 0,
    medicalDepartments: stats?.medicalDepartments || 0,
    emergencySupport: stats?.emergencySupport || '24/7'
  });

  React.useEffect(() => {
    if (stats) {
      setFormData({
        expertDoctors: stats.expertDoctors,
        happyPatients: stats.happyPatients,
        medicalDepartments: stats.medicalDepartments,
        emergencySupport: stats.emergencySupport
      });
    }
  }, [stats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStats(formData);
      toast.success('Stats updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update stats');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Statistics Management</h1>
            <p className="text-gray-600">Update homepage statistics and counters</p>
          </motion.div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-rose-600" />
                Update Homepage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expert Doctors
                    </label>
                    <Input
                      type="number"
                      value={formData.expertDoctors}
                      onChange={(e) => setFormData({
                        ...formData,
                        expertDoctors: parseInt(e.target.value) || 0
                      })}
                      placeholder="50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Happy Patients
                    </label>
                    <Input
                      type="number"
                      value={formData.happyPatients}
                      onChange={(e) => setFormData({
                        ...formData,
                        happyPatients: parseInt(e.target.value) || 0
                      })}
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Departments
                    </label>
                    <Input
                      type="number"
                      value={formData.medicalDepartments}
                      onChange={(e) => setFormData({
                        ...formData,
                        medicalDepartments: parseInt(e.target.value) || 0
                      })}
                      placeholder="15"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Support
                    </label>
                    <Input
                      value={formData.emergencySupport}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencySupport: e.target.value
                      })}
                      placeholder="24/7"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Statistics
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatsManager;
