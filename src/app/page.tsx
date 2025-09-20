'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProductShowcase from '@/components/ProductShowcase';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section with Parallax */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative"
      >
        <HeroSection />
      </motion.div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Newsletter Form */}
      <NewsletterForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}