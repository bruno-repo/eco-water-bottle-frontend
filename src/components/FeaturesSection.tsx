'use client';

import { motion } from 'framer-motion';
import { Droplets, Leaf, Shield, Thermometer, Zap, Heart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Eco-Friendly",
      description: "Made from sustainable materials that biodegrade naturally, leaving zero environmental footprint.",
      color: "text-green-600"
    },
    {
      icon: Droplets,
      title: "Leak-Proof Design",
      description: "Advanced sealing technology ensures your drink stays exactly where it should be.",
      color: "text-blue-600"
    },
    {
      icon: Thermometer,
      title: "Temperature Control",
      description: "Keeps drinks cold for 24 hours or hot for 12 hours with our innovative insulation.",
      color: "text-red-600"
    },
    {
      icon: Shield,
      title: "BPA-Free Materials",
      description: "Safe for daily use with food-grade materials that protect your health.",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Lightweight & Durable",
      description: "Built to last with premium materials that won't weigh you down.",
      color: "text-yellow-600"
    },
    {
      icon: Heart,
      title: "Health-First Design",
      description: "Ergonomic design promotes better hydration habits and overall wellness.",
      color: "text-pink-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our
            <span className="text-green-600"> Eco Bottles?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the perfect combination of sustainability, functionality, and style. 
            Our bottles are designed with both you and the planet in mind.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 ${feature.color} bg-current/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={32} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;