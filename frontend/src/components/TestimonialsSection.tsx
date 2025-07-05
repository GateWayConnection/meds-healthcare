
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTestimonials } from '../hooks/useTestimonials';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const TestimonialsSection = () => {
  const { testimonials, loading, createTestimonial } = useTestimonials();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    treatment: ''
  });

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestimonial(formData);
      toast.success('Testimonial submitted for review!');
      setIsDialogOpen(false);
      setFormData({ content: '', rating: 5, treatment: '' });
    } catch (error) {
      toast.error('Failed to submit testimonial');
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            What Our Patients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Real stories from real patients who trust MEDS Healthcare for their medical needs.
          </motion.p>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative">
            <div className="flex justify-center">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-2xl"
              >
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Quote className="w-12 h-12 text-rose-500" />
                    </div>
                    <p className="text-lg text-gray-700 mb-6 italic">
                      "{testimonials[currentIndex]?.content}"
                    </p>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex]?.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonials[currentIndex]?.patientName}
                      </p>
                      {testimonials[currentIndex]?.treatment && (
                        <p className="text-sm text-gray-600">
                          {testimonials[currentIndex]?.treatment}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center mt-6 space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  ←
                </Button>
                <div className="flex space-x-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  →
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No testimonials yet. Be the first to share your experience!</p>
          </div>
        )}

        {user && (
          <div className="text-center mt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Share Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Testimonial</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                  <div>
                    <Label htmlFor="content">Your Experience</Label>
                    <Textarea
                      id="content"
                      placeholder="Tell us about your experience with MEDS Healthcare..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      maxLength={500}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <select
                      id="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ Very Good</option>
                      <option value={3}>⭐⭐⭐ Good</option>
                      <option value={2}>⭐⭐ Fair</option>
                      <option value={1}>⭐ Poor</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="treatment">Treatment/Service (Optional)</Label>
                    <Input
                      id="treatment"
                      placeholder="e.g., Cardiology Consultation"
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                    Submit Testimonial
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
