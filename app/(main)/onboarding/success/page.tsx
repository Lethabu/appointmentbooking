import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SignUpSuccessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4">Registration Successful!</CardTitle>
          <CardDescription>Your salon is ready to be set up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            An email has been sent to your address with further instructions.
            In the meantime, you can get started by configuring your custom domain.
          </p>
          <div className="p-4 bg-gray-100 rounded-md text-sm">
            <h3 className="font-semibold mb-2">Next Steps: DNS Configuration</h3>
            <p className="text-left">
              To use your custom domain, please create a CNAME record with your domain provider pointing to:
              <br />
              <code className="bg-gray-200 p-1 rounded">cname.appointmentbooking.co.za</code>
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
