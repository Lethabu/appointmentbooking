'use client';
import { useState, useEffect, Suspense } from 'react';
import { Step1_Services } from '@/components/booking/Step1_Services';
import { Step2_DateTime } from '@/components/booking/Step2_DateTime';
import { Step3_Upsells } from '@/components/booking/Step3_Upsells';
import { Step4_Payment } from '@/components/booking/Step4_Payment';
import { Progress } from '@/components/ui/progress';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Id } from "convex/_generated/dataModel";

const steps = ['Services', 'Date & Time', 'Add-ons', 'Payment', 'Success'];

function BookingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({});
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const createBooking = useMutation(api.bookings.createBooking);
  const { userId } = useAuth();
  const searchParams = useSearchParams();

    useEffect(() => {
    if (searchParams) {
      const ref = searchParams.get('ref');
      if (ref) {
        setReferralCode(ref);
      }
    }
  }, [searchParams]);

  const handleBookingSuccess = async (paymentData: unknown) => {
    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    try {
      await createBooking({
        tenantId: "instyle" as Id<"tenants">, // Placeholder, should be dynamic
        userId: userId,
        serviceIds: data.serviceIds,
        start: data.startTime,
        amount: data.totalAmount,
        ...(referralCode && { referralCode }), // Pass referralCode if available
      });
      setStep(4); // Move to success step
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  // A simple confetti component, replace with a library if you want something fancier
  const Confetti = () => {
    return <div className="text-2xl">🎉 Booking Successful! 🎉</div>;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Progress value={(step + 1) * 25} />
      <h1 className="text-3xl font-bold my-4">{steps[step]}</h1>
      {step === 0 && <Step1_Services onNext={d => {setData({...data, ...d}); setStep(1)}} />}
      {step === 1 && <Step2_DateTime onNext={d => {setData({...data, ...d}); setStep(2)}} />}
      {step === 2 && <Step3_Upsells onNext={d => {setData({...data, ...d}); setStep(3)}} />}
      {step === 3 && <Step4_Payment data={data} onSuccess={handleBookingSuccess} />}
      {step === 4 && <Confetti />}
    </div>
  );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingFlow />
        </Suspense>
    )
}

interface BookingData {
  serviceIds?: string[];
  startTime?: string;
  totalAmount?: number;
}