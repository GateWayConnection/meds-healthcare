import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Home = () => {
  const stats = [
    {
      label: "Happy Patients",
      value: "3,249+",
      icon: Users,
    },
    {
      label: "Years of Experience",
      value: "10+",
      icon: Clock,
    },
    {
      label: "Successful Treatments",
      value: "98%",
      icon: Shield,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find the best doctors, book appointments, and get expert health
                advice all in one place.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book an Appointment <ArrowRight className="ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
            >
              <img
                src="/hero-image.svg"
                alt="Healthcare Illustration"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <stat.icon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <SpecialtiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            Ready to Transform Your Health?
          </motion.h2>
          <motion.p
            className="text-xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            Join thousands of satisfied patients and take control of your
            health today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Find a Doctor
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
