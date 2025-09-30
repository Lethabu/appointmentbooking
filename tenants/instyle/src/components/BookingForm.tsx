// tenants/instyle/src/components/BookingForm.tsx
// This component assumes react-hook-form is installed and configured.

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

const BookingForm = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const res = await fetch('/api/book', {
      method: 'POST',
      body: JSON.stringify({ ...data, tenantId: 'instyle' }),
    });
    if (res.ok) router.push('/success');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Example form fields - replace with actual HTML from the static page */}
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" {...register('name', { required: true })} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register('email', { required: true })} />
      </div>
      <button type="submit">Submit Booking</button>
    </form>
  );
};

export default BookingForm;