import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Scissors,
  Palette,
  Sparkles,
} from 'lucide-react';

interface ModernService {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
}

export default function ModernBookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ModernService | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const services = [
    {
      id: 1,
      name: 'Premium Cut & Style',
      duration: '60 min',
      price: 250,
      description: 'Professional haircut with styling',
      icon: Scissors,
      popular: true,
    },
    {
      id: 2,
      name: 'Color & Highlights',
      duration: '120 min',
      price: 450,
      description: 'Full color service with highlights',
      icon: Palette,
    },
    {
      id: 3,
      name: 'Keratin Treatment',
      duration: '150 min',
      price: 380,
      description: 'Smoothing treatment',
      icon: Sparkles,
    },
  ];

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  const steps = [
    { number: 1, title: 'Select Service' },
    { number: 2, title: 'Pick Date & Time' },
    { number: 3, title: 'Your Details' },
    { number: 4, title: 'Confirm' },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3:
        return (
          customerDetails.name && customerDetails.email && customerDetails.phone
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.number
                ? 'bg-purple-500 border-purple-500 text-white'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            {currentStep > step.number ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">{step.number}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                currentStep > step.number ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const ServiceCard = ({ service }: { service: ModernService }) => (
    <div
      onClick={() => setSelectedService(service)}
      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        selectedService?.id === service.id
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      {service.popular && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Popular
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <service.icon className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {service.name}
          </h3>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-purple-600">
            R{service.price}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {service.duration}
          </span>
        </div>
        {selectedService?.id === service.id && (
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StepIndicator />

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep - 1].title}
              </h2>
            </div>

            <div className="mb-8">
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Date
                    </h3>
                    <input
                      type="date"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Select Time
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              selectedTime === time
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      placeholder="+27 12 345 6789"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Booking Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-semibold">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-semibold">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">
                        R{selectedService?.price}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={() =>
                  currentStep < 4
                    ? setCurrentStep(currentStep + 1)
                    : console.log('Book!')
                }
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {currentStep < 4 ? 'Continue' : 'Confirm Booking'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
