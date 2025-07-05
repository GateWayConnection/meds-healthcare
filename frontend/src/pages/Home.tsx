
import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import SpecialtiesSection from '../components/SpecialtiesSection';
import TestimonialsSection from '../components/TestimonialsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <SpecialtiesSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Home;
