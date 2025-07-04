import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import FindDoctor from "./pages/FindDoctor";
import BookAppointment from "./pages/BookAppointment";
import HealthNavigation from "./pages/HealthNavigation";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// New Feature Pages
import Chat from "./pages/Chat";
import Academics from "./pages/Academics";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";


// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ManageAvailability from "./pages/doctor/ManageAvailability";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import UserManager from "./pages/admin/UserManager";
import SpecialtyManager from "./pages/admin/SpecialtyManager";
import DoctorManager from "./pages/admin/DoctorManager";
import StatsManager from "./pages/admin/StatsManager";
import CourseManager from "./pages/admin/CourseManager";
import BlogManager from "./pages/admin/BlogManager";
import CategoryManager from "./pages/admin/CategoryManager";
import AppointmentManager from "./pages/admin/AppointmentManager";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/find-doctor" element={<FindDoctor />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/health-navigation" element={<HealthNavigation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* New Feature Routes */}
                <Route path="/chat" element={<Chat />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                
                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/appointments" element={<MyAppointments />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                
                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/availability" element={<ManageAvailability />} />
                <Route path="/doctor/profile" element={<DoctorProfile />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/users" element={<UserManager />} />
                <Route path="/admin/specialties" element={<SpecialtyManager />} />
                <Route path="/admin/doctors" element={<DoctorManager />} />
                <Route path="/admin/stats" element={<StatsManager />} />
                <Route path="/admin/courses" element={<CourseManager />} />
                <Route path="/admin/blogs" element={<BlogManager />} />
                <Route path="/admin/categories" element={<CategoryManager />} />
                <Route path="/admin/appointments" element={<AppointmentManager />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
