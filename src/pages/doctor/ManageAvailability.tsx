
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Calendar, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

const ManageAvailability = () => {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '13:00' },
    sunday: { enabled: false, start: '09:00', end: '13:00' }
  });

  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const handleSave = () => {
    toast.success('Availability updated successfully!');
  };

  const updateDay = (day: string, field: string, value: any) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Availability</h1>
            <p className="text-gray-600">Set your working hours and availability</p>
          </motion.div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-rose-600" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={availability[day as keyof typeof availability].enabled}
                      onCheckedChange={(checked) => updateDay(day, 'enabled', checked)}
                    />
                    <Label className="capitalize font-medium w-20">{day}</Label>
                  </div>
                  
                  {availability[day as keyof typeof availability].enabled && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <Input
                          type="time"
                          value={availability[day as keyof typeof availability].start}
                          onChange={(e) => updateDay(day, 'start', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={availability[day as keyof typeof availability].end}
                        onChange={(e) => updateDay(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <Button onClick={handleSave} className="w-full bg-rose-600 hover:bg-rose-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAvailability;
