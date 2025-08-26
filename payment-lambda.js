const { z } = require('zod');

const logger = {
  info: (message, data) => console.log(JSON.stringify({ level: 'INFO', message, ...data })),
  error: (message, error, data) => console.error(JSON.stringify({ level: 'ERROR', message, error: error.message, ...data })),
};

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  email: z.string().email(),
  reference: z.string(),
});

/**
 * AWS Lambda handler for processing payments with Netcash.
 * This is a stub and needs to be implemented with the actual Netcash API.
 */
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }), headers };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
    logger.info('Received payment request', { body: requestBody });
  } catch (e) {
    logger.error('Failed to parse request body', e);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }), headers };
  }

  const validationResult = paymentSchema.safeParse(requestBody);
  if (!validationResult.success) {
    logger.error('Payment validation failed', { error: validationResult.error.flatten(), body: requestBody });
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input', details: validationResult.error.flatten() }), headers };
  }

  // TODO: Implement Netcash API integration here
  logger.info('Payment processing stub', { data: validationResult.data });

  // Simulate a successful payment
  const response = {
    success: true,
    message: 'Payment processed successfully (stub)',
    transaction_id: `txn_${Date.now()}`,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers,
  };
};