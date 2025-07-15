'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createService } from '@/lib/services/service';

const ServiceSchema = Yup.object().shape({
  name: Yup.string().required('Service name is required'),
  description: Yup.string(),
  duration: Yup.number().required('Duration is required').positive('Must be positive').integer(),
  price: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
});

export default function ServiceForm({ onServiceAdded }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      duration: 30,
      price: 100,
    },
    validationSchema: ServiceSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError(null);
      setSuccess(null);
      try {
        await createService(values);
        setSuccess('Service added successfully!');
        resetForm();
        if (onServiceAdded) {
          onServiceAdded();
        }
      } catch (error) {
        setError(error.message);
      }
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4 border rounded-lg">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Service Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-600 text-sm">{formik.errors.name}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration (minutes)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.duration}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {formik.touched.duration && formik.errors.duration ? (
            <div className="text-red-600 text-sm">{formik.errors.duration}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price (R)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-red-600 text-sm">{formik.errors.price}</div>
          ) : null}
        </div>
      </div>

      <button type="submit" disabled={formik.isSubmitting} className="btn w-full">
        {formik.isSubmitting ? 'Adding...' : 'Add Service'}
      </button>
    </form>
  );
}
