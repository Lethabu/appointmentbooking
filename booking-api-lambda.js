const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');

/**
 * A structured logger that masks Personally Identifiable Information (PII) in logs.
 * This helps prevent sensitive data from being exposed in CloudWatch logs.
 */
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...redact(data) }));
  },
  error: (message, error, data) => {
    console.error(JSON.stringify({ level: 'ERROR', message, error: error.message, stack: error.stack, ...redact(data) }));
  },
};

/**
 * Redacts sensitive keys from an object.
 * @param {object} data The object to redact.
 * @returns {object} A new object with PII fields replaced with '[REDACTED]'.
 */
function redact(data = {}) {
  const redactedData = { ...data };
  const piiKeys = ['email', 'notes', 'clientName', 'phone'];
  for (const key of piiKeys) {
    if (redactedData[key]) {
      redactedData[key] = '[REDACTED]';
    }
  }
  return redactedData;
}

/**
 * Zod schema for validating the booking request payload.
 * Ensures that the input is well-formed before processing.
 */
const bookingSchema = z.object({
  tenant_id: z.string().uuid({ message: "Invalid tenant ID format." }),
  service_id: z.string().uuid({ message: "Invalid service ID format." }),
  user_id: z.string().uuid({ message: "Invalid user ID format." }),
  time: z.string().datetime({ message: "Invalid datetime format." }).refine(val => new Date(val) > new Date(), {
    message: "Appointment time must be in the future.",
  }),
  notes: z.string().max(500, { message: "Notes must be 500 characters or less." }).optional(),
});

// Initialize Supabase client from environment variables.
// These should be securely stored in the Lambda's configuration.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * AWS Lambda handler for creating a new booking.
 * @param {object} event The API Gateway event object.
 * @returns {object} An HTTP response object.
 */
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*', // Restrict this in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }), headers };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
    logger.info('Received booking request', { body: requestBody });
  } catch (e) {
    logger.error('Failed to parse request body', e);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }), headers };
  }

  // 1. Validate Input Payload
  const validationResult = bookingSchema.safeParse(requestBody);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.flatten();
    logger.error('Booking validation failed', { error: errorDetails, body: requestBody });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input', details: errorDetails }),
      headers,
    };
  }

  const { tenant_id, service_id, user_id, time, notes } = validationResult.data;

  try {
    // 2. Insert the new appointment into the database
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        tenant_id,
        service_id,
        user_id,
        time,
        notes,
        status: 'confirmed', // Default status for a new booking
      }])
      .select()
      .single();

    if (error) {
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        logger.error('Conflict: Appointment already exists.', error, validationResult.data);
        return { statusCode: 409, body: JSON.stringify({ error: 'This appointment slot is no longer available.' }), headers };
      }
      logger.error('Supabase insert error', error, validationResult.data);
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not create appointment.', details: error.message }), headers };
    }

    logger.info('Booking successful', { appointment: data });
    return {
      statusCode: 201,
      body: JSON.stringify(data),
      headers,
    };

  } catch (e) {
    logger.error('Unhandled exception in booking handler', e, validationResult.data);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unexpected error occurred.' }),
      headers,
    };
  }
};

