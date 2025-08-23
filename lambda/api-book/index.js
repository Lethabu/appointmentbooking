const { Client } = require('pg');

exports.handler = async (event) => {
  const { service, date, time, name, email, phone } = JSON.parse(event.body);

  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@appointmentbookings-db.c6ze40o8a4ho.us-east-1.rds.amazonaws.com:5432/${process.env.DB_NAME}`,
  });

  try {
    await client.connect();

    const query = `
      INSERT INTO appointments (service, date, time, name, email, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

    const values = [service, date, time, name, email, phone];

    const result = await client.query(query, values);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Appointment created successfully',
        appointmentId: result.rows[0].id,
      }),
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating appointment',
        error: error.message,
      }),
    };
  } finally {
    await client.end();
  }
};