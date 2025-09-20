'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { apiClient } from '@/lib/api';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest')
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const NewsletterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange'
  });

  const watchedEmail = watch('email');
  const watchedFirstName = watch('firstName');

  const interests = [
    { id: 'eco-tips', label: 'Eco-friendly Tips' },
    { id: 'new-products', label: 'New Product Launches' },
    { id: 'sustainability', label: 'Sustainability News' },
    { id: 'health-wellness', label: 'Health & Wellness' },
    { id: 'special-offers', label: 'Special Offers' }
  ];

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Call backend API
      const response = await apiClient.subscribeToNewsletter(data);

      if (response.success) {
        setSubmitStatus('success');
        setMessage('Thank you for subscribing! Check your email for confirmation.');
        reset();
      } else {
        throw new Error(response.message || 'Subscription failed');
      }
    } catch {
      setSubmitStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay in the Loop
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Get the latest updates on eco-friendly products, sustainability tips, 
              and exclusive offers delivered straight to your inbox.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-white font-medium">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('firstName')}
                      type="text"
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 ${
                        errors.firstName
                          ? 'border-red-400 focus:border-red-500'
                          : watchedFirstName && !errors.firstName
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-white/30 focus:border-white'
                      }`}
                    />
                    {watchedFirstName && !errors.firstName && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {errors.firstName && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </div>
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-300 text-sm"
                    >
                      {errors.firstName.message}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-white font-medium">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500'
                          : watchedEmail && !errors.email
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-white/30 focus:border-white'
                      }`}
                    />
                    {watchedEmail && !errors.email && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {errors.email && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-300 text-sm"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <label className="block text-white font-medium">
                  What interests you? (Select at least one) *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <motion.label
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300"
                    >
                      <input
                        {...register('interests')}
                        type="checkbox"
                        value={interest.id}
                        className="w-4 h-4 text-green-600 bg-white/90 border-white/30 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-white text-sm font-medium">
                        {interest.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
                {errors.interests && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm"
                  >
                    {errors.interests.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isValid || isSubmitting}
                whileHover={{ scale: isValid && !isSubmitting ? 1.05 : 1 }}
                whileTap={{ scale: isValid && !isSubmitting ? 0.95 : 1 }}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isValid && !isSubmitting
                    ? 'bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl'
                    : 'bg-white/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Subscribe Now</span>
                  </>
                )}
              </motion.button>

              {/* Status Message */}
              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-center space-x-3 ${
                    submitStatus === 'success'
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                      : 'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}
                >
                  {submitStatus === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span>{message}</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-green-100"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span className="text-sm">No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span className="text-sm">Unsubscribe anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span className="text-sm">Privacy protected</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterForm;