import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useDoctorProfile } from '../../hooks/useDoctorProfile';
import { toast } from 'sonner';

const DoctorReports = () => {
  const { reports, generateReports, loading } = useDoctorProfile();
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await generateReports();
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reports) return;

    const reportData = {
      ...reports,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `doctor-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Report downloaded successfully!');
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
            <p className="text-gray-600">View your performance metrics and download detailed reports</p>
          </motion.div>

          {/* Generate Report Section */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate New Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2">
                    Generate a comprehensive report of your appointments, revenue, and performance metrics.
                  </p>
                  <p className="text-sm text-gray-500">
                    Reports include appointment statistics, patient interactions, and financial summaries.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generating || loading}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {generating ? 'Generating...' : 'Generate Report'}
                  </Button>
                  {reports && (
                    <Button
                      onClick={handleDownloadReport}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Data */}
          {reports && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Doctor Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Doctor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{reports.doctorInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialty</p>
                      <p className="font-semibold">{reports.doctorInfo.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="font-semibold">${reports.doctorInfo.consultationFee}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Appointments"
                  value={reports.summary.totalAppointments}
                  icon={Calendar}
                  color="text-blue-600"
                />
                <StatCard
                  title="Completed"
                  value={reports.summary.completedAppointments}
                  icon={CheckCircle}
                  color="text-green-600"
                />
                <StatCard
                  title="Pending"
                  value={reports.summary.pendingAppointments}
                  icon={Clock}
                  color="text-yellow-600"
                />
                <StatCard
                  title="This Month"
                  value={reports.summary.thisMonthTotal}
                  icon={TrendingUp}
                  color="text-purple-600"
                />
              </div>

              {/* Revenue Section */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800">Estimated Revenue</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${reports.summary.estimatedRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600">
                        Based on completed appointments
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800">Confirmed Revenue</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(reports.summary.confirmedAppointments * reports.doctorInfo.consultationFee).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600">
                        From confirmed appointments
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800">Average per Visit</h3>
                      <p className="text-2xl font-bold text-gray-600">
                        ${reports.doctorInfo.consultationFee}
                      </p>
                      <p className="text-sm text-gray-600">
                        Consultation fee
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Breakdown */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Appointment Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{reports.summary.confirmedAppointments}</p>
                      <p className="text-sm text-gray-600">Confirmed</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{reports.summary.pendingAppointments}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{reports.summary.completedAppointments}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{reports.summary.cancelledAppointments}</p>
                      <p className="text-sm text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.recentAppointments.length > 0 ? (
                      reports.recentAppointments.slice(0, 5).map((appointment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{appointment.patientName}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No recent appointments</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Report Generation Info */}
              <Card className="shadow-lg border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Report Generated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reports.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!reports && !loading && (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Generated</h3>
                <p className="text-gray-500">Click "Generate Report" to create your first performance report.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorReports;