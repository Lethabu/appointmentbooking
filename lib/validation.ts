interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: string[];
}

interface ValidationSchema {
  validate: (data: any) => ValidationResult;
}

// Simple validation schemas without external dependencies
export const demoRequestSchema: ValidationSchema = {
  validate: (data: any): ValidationResult => {
    const errors: string[] = [];

    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      errors.push('Name must be between 2 and 100 characters');
    }

    if (!data.email || !isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (
      !data.salonName ||
      data.salonName.length < 2 ||
      data.salonName.length > 100
    ) {
      errors.push('Salon name must be between 2 and 100 characters');
    }

    if (data.phone && !isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return errors.length === 0
      ? { success: true, data }
      : { success: false, errors };
  },
};

export const bookingSchema: ValidationSchema = {
  validate: (data: any): ValidationResult => {
    const errors: string[] = [];

    if (!data.serviceId) {
      errors.push('Service ID is required');
    }

    if (!data.scheduledTime || !isValidDateTime(data.scheduledTime)) {
      errors.push('Valid scheduled time is required');
    }

    if (!data.clientName || data.clientName.length < 2) {
      errors.push('Client name is required');
    }

    if (!data.clientPhone || !isValidPhone(data.clientPhone)) {
      errors.push('Valid phone number is required');
    }

    if (!data.clientEmail || !isValidEmail(data.clientEmail)) {
      errors.push('Valid email is required');
    }

    return errors.length === 0
      ? { success: true, data }
      : { success: false, errors };
  },
};

// Sanitization helpers
export function sanitizeInput(input: any): any {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '').trim();
}

export function validateAndSanitize(
  data: any,
  schema: ValidationSchema,
): ValidationResult {
  try {
    // Sanitize string inputs
    const sanitized = Object.keys(data).reduce((acc: any, key) => {
      acc[key] = sanitizeInput(data[key]);
      return acc;
    }, {});

    // Validate with schema
    const validated = schema.validate(sanitized);
    return validated;
  } catch (error: any) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidDateTime(dateTime: string): boolean {
  const date = new Date(dateTime);
  return date instanceof Date && !isNaN(date.getTime());
}
