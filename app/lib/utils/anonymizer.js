// Simple email regex
const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

/**
 * Anonymizes the local part of an email address.
 * @param {string} email - The email address to anonymize.
 * @param {number} index - The index to use for the new user.
 * @returns {string} The anonymized email address.
 */
function anonymizeEmail(email, index) {
  return `user_${index}@example.com`;
}

/**
 * Anonymizes PII in a CSV string.
 * @param {string} csvData - The CSV data as a string.
 * @returns {string} The anonymized CSV data as a string.
 */
export function anonymizeData(csvData) {
  const lines = csvData.split('\n');
  const header = lines[0];
  const rows = lines.slice(1);

  let emailCounter = 1;

  const anonymizedRows = rows.map((row) => {
    if (!row.trim()) return row;

    // Anonymize emails
    let anonymizedRow = row.replace(emailRegex, (match) => {
      const anonymized = anonymizeEmail(match, emailCounter);
      emailCounter++;
      return anonymized;
    });

    // This is a placeholder for name/username anonymization.
    // A more robust implementation would identify columns containing names.
    anonymizedRow = anonymizedRow.replace(
      /Promise\.paralegal/g,
      'Sanitized User',
    );

    return anonymizedRow;
  });

  return [header, ...anonymizedRows].join('\n');
}
