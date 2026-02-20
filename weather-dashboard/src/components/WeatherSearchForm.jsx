import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const WeatherSearchForm = ({ onSearch, isLoading }) => {
  const formik = useFormik({
    initialValues: {
      city: '',
      unit: 'metric'
    },
    validationSchema: Yup.object({
      city: Yup.string()
        .required('City name is required')
        .min(2, 'City name must be at least 2 characters')
        .matches(/^[a-zA-Z\s-]+$/, 'City name can only contain letters, spaces, and hyphens'),
      unit: Yup.string().oneOf(['metric', 'imperial'])
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      onSearch(values.city, values.unit);
      setSubmitting(false);
      resetForm({ values: { city: '', unit: values.unit } });
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter city name..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  formik.touched.city && formik.errors.city
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || formik.isSubmitting}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {formik.touched.city && formik.errors.city && (
            <p className="mt-1 text-red-500 text-sm">{formik.errors.city}</p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="unit"
              value="metric"
              checked={formik.values.unit === 'metric'}
              onChange={formik.handleChange}
              className="text-blue-500"
            />
            <span className="text-gray-700">Celsius (°C)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="unit"
              value="imperial"
              checked={formik.values.unit === 'imperial'}
              onChange={formik.handleChange}
              className="text-blue-500"
            />
            <span className="text-gray-700">Fahrenheit (°F)</span>
          </label>
        </div>
      </div>
    </form>
  );
};

export default WeatherSearchForm;