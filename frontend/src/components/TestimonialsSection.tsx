
import { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useTestimonials } from '../hooks/useTestimonials';
import { toast } from 'sonner';

export default function TestimonialsSection() {
  const { testimonials, loading, error, createTestimonial } = useTestimonials();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    treatment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('📊 Testimonials state:', { testimonials, loading, error });

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Please write your testimonial');
      return;
    }

    try {
      setIsSubmitting(true);
      await createTestimonial(formData);
      setFormData({ content: '', rating: 5, treatment: '' });
      setShowForm(false);
      toast.success('Thank you for your testimonial! It will be reviewed before publishing.');
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real patients who trust MEDS Healthcare for their medical needs.
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading testimonials: {error}</p>
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No testimonials yet. Be the first to share your experience!</p>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="mb-12">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial._id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Quote className="w-6 h-6 text-blue-600 mr-2" />
                          <div className="flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 italic">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {testimonial.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {testimonial.patientName}
                            </p>
                            {testimonial.treatment && (
                              <p className="text-sm text-gray-600">
                                {testimonial.treatment}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <div className="text-center">
          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
            >
              Share Your Experience
            </Button>
          ) : (
            <Card className="max-w-md mx-auto bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Share Your Testimonial</h3>
                <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                  <Textarea
                    placeholder="Tell us about your experience..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="min-h-[100px]"
                    required
                  />
                  <Input
                    placeholder="Treatment/Service (optional)"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Rating:</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              rating <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
