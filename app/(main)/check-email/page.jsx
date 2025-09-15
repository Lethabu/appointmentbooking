'use client';

export default function CheckEmailPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-gray-600">
          We've sent a confirmation link to your email address. Please click the
          link to complete your registration.
        </p>
      </div>
    </div>
  );
}
