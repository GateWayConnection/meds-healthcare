
// Initialize demo data in localStorage
export const initializeDemoData = () => {
  // Check if demo data already exists
  if (!localStorage.getItem('users')) {
    const demoUsers = [
      {
        id: '1',
        name: 'John Patient',
        email: 'patient@demo.com',
        password: 'password',
        role: 'patient',
        phone: '+249123456789',
        dateOfBirth: '1990-01-01',
        verified: true
      },
      {
        id: '2',
        name: 'Dr. Sarah Ahmed',
        email: 'doctor@demo.com',
        password: 'password',
        role: 'doctor',
        specialty: 'Cardiology',
        phone: '+249987654321',
        verified: true,
        licenseNumber: 'MD12345',
        experience: 10
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin',
        verified: true
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }

  // Initialize appointments
  if (!localStorage.getItem('appointments')) {
    const demoAppointments = [
      {
        id: '1',
        patientId: '1',
        doctorId: '2',
        doctorName: 'Dr. Sarah Ahmed',
        patientName: 'John Patient',
        date: '2024-06-15',
        time: '10:00',
        specialty: 'Cardiology',
        status: 'confirmed',
        notes: 'Regular checkup'
      }
    ];
    
    localStorage.setItem('appointments', JSON.stringify(demoAppointments));
  }

  // Initialize doctors
  if (!localStorage.getItem('doctors')) {
    const demoDoctors = [
      {
        id: '2',
        name: 'Dr. Sarah Ahmed',
        specialty: 'Cardiology',
        experience: 10,
        rating: 4.9,
        languages: ['English', 'Arabic'],
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        timeSlots: ['09:00-12:00', '14:00-17:00'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'
      },
      {
        id: '4',
        name: 'Dr. Mohamed Hassan',
        specialty: 'Pediatrics',
        experience: 8,
        rating: 4.8,
        languages: ['Arabic', 'English'],
        availability: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: ['08:00-11:00', '15:00-18:00'],
        verified: true,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'
      }
    ];
    
    localStorage.setItem('doctors', JSON.stringify(demoDoctors));
  }
};
