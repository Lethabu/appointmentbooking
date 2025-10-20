#!/usr/bin/env node
/**
 * Script to format Firebase private key for environment variables.
 * It reads a multi-line JSON from stdin and outputs a single-line,
 * stringified version.
 *
 * Usage:
 * 1. Run: node scripts/format-firebase-key.js
 * 2. Paste your Firebase service account JSON.
 * 3. Press Ctrl+D (on Linux/macOS) or Ctrl+Z then Enter (on Windows) to finish.
 */
const readline = require('readline');

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Paste your Firebase service account JSON here and press Ctrl+D (or Ctrl+Z on Windows) when done:\n',
  });
  rl.prompt();

  let input = '';
  for await (const line of rl) {
    input += line;
  }

  try {
    if (!input.trim()) {
      console.error('\nError: No input received. Please paste the JSON content.');
      process.exit(1);
    }

    const serviceAccount = JSON.parse(input.trim());

    // The private_key needs its newlines escaped for a single-line env var.
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\n/g, '\\n');
    }

    // Output the entire object as a single-line, stringified JSON.
    const formatted = JSON.stringify(serviceAccount);

    console.log('\n\n=== FORMATTED FIREBASE_SERVICE_ACCOUNT_KEY ===');
    console.log('\n✅ Copy the line above and add it to your .env.local or .env.production file:');
    console.log('FIREBASE_SERVICE_ACCOUNT_KEY=' + formatted);
  } catch (error) {
    console.error('\n❌ Error parsing JSON:', error.message);
    console.error('Please ensure you pasted the complete and valid JSON from your Firebase service account file.');
    process.exit(1);
  }
}

main();