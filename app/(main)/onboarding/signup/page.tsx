'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    salonName: '',
    requestedSlug: '',
    customDomain: '',
    ownerEmail: '',
    ownerPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }

      toast({
        title: 'Success!',
        description: 'Your salon has been registered. Please check your email for next steps.',
      });

      // Redirect to a success page with instructions
      router.push('/onboarding/success');

    } catch (error: any) {
      toast({
        title: 'Sign-up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register Your Salon</CardTitle>
          <CardDescription>Start your journey with us. Fill out the form below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="salonName">Salon Name</Label>
              <Input
                id="salonName"
                name="salonName"
                type="text"
                value={formData.salonName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="requestedSlug">Subdomain</Label>
              <Input
                id="requestedSlug"
                name="requestedSlug"
                type="text"
                placeholder="e.g., 'my-salon'"
                value={formData.requestedSlug}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Your URL: {formData.requestedSlug || '[subdomain]'}.appointmentbooking.co.za
              </p>
            </div>
            <div>
              <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
              <Input
                id="customDomain"
                name="customDomain"
                type="text"
                placeholder="e.g., 'www.my-salon.com'"
                value={formData.customDomain}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="ownerEmail">Your Email</Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerPassword">Password</Label>
              <Input
                id="ownerPassword"
                name="ownerPassword"
                type="password"
                value={formData.ownerPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
