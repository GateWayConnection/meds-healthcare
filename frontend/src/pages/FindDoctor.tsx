
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../hooks/useSpecialties';
import { Link } from 'react-router-dom';

const FindDoctor = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const { doctors, loading: doctorsLoading } = useDoctors();
  const { specialties } = useSpecialties();

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty && doctor.isActive && doctor.isVerified;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('findDoctor.title')}</h1>
              <p className="text-xl text-gray-600">{t('findDoctor.subtitle')}</p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('findDoctor.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('findDoctor.allSpecialties')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('findDoctor.allSpecialties')}</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty._id} value={specialty.name}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {doctorsLoading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Loading doctors...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                            {doctor.avatar ? (
                              <img
                                src={doctor.avatar}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-rose-600 font-semibold text-xl">
                                {doctor.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <div className="flex items-center mt-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">4.8</span>
                              <span className="text-sm text-gray-500 ml-2">
                                {doctor.experience} years exp
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {doctor.bio}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Available Online</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            License: {doctor.licenseNumber}
                          </div>
                        </div>
                        
                        <Link to="/book-appointment" state={{ selectedDoctor: doctor }}>
                          <Button className="w-full bg-rose-600 hover:bg-rose-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            {t('findDoctor.bookAppointment')}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!doctorsLoading && filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  {t('findDoctor.noResults')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDoctor;
