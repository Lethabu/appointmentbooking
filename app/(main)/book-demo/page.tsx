'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, TrendingUp, Star } from 'lucide-react';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salonName: '',
    salonSize: '',
    currentSolution: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        alert('Error: ' + (error.error || 'Failed to submit demo request'));
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert('Failed to submit demo request. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Demo Booked!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your interest! We&apos;ll contact you within 24
              hours to schedule your personalized demo.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Book Another Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
            🚀 Free 30-minute demo
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            See the Platform in action
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book a personalized demo and discover how we can transform your
            salon operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book Your Free Demo</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll show you exactly how the
                Platform can help your salon grow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="salonName">Salon Name *</Label>
                  <Input
                    id="salonName"
                    value={formData.salonName}
                    onChange={(e) =>
                      handleInputChange('salonName', e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salonSize">Salon Size</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange('salonSize', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salon size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo stylist</SelectItem>
                      <SelectItem value="small">2-5 staff members</SelectItem>
                      <SelectItem value="medium">6-15 staff members</SelectItem>
                      <SelectItem value="large">16+ staff members</SelectItem>
                      <SelectItem value="chain">Multiple locations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currentSolution">
                    Current Booking Solution
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange('currentSolution', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How do you currently manage bookings?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone calls only</SelectItem>
                      <SelectItem value="paper">
                        Paper appointment book
                      </SelectItem>
                      <SelectItem value="excel">Excel/Google Sheets</SelectItem>
                      <SelectItem value="other-software">
                        Other booking software
                      </SelectItem>
                      <SelectItem value="none">No system currently</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Tell us about your needs</Label>
                  <Textarea
                    id="message"
                    placeholder="What challenges are you facing with your current booking process?"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange('message', e.target.value)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Book My Free Demo
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  What you&apos;ll see in the demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Complete booking flow from customer perspective
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Admin dashboard and appointment management
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Automated notifications and reminders
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Revenue analytics and reporting
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Custom branding and setup process
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Results you can expect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      300%
                    </div>
                    <div className="text-sm text-gray-600">
                      Increase in online bookings
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">80%</div>
                    <div className="text-sm text-gray-600">
                      Reduction in no-shows
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">60%</div>
                    <div className="text-sm text-gray-600">Less admin work</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">25%</div>
                    <div className="text-sm text-gray-600">
                      Revenue increase
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  What our customers say
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic text-gray-600 mb-3">
                  &quot;The Platform transformed our salon operations.
                  We&apos;ve seen a 300% increase in online bookings and our
                  customers love the convenience!&quot;
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    - Sarah M., InStyle Hair Boutique
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
