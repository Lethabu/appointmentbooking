# Firebase Service Account Setup

## Steps to get your Firebase service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `appointmentbookings-459617`
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file

## Format the key for environment variables:

### Option 1: Use the formatting script (Recommended)

This method avoids copy-paste errors by piping the file content directly to the script. Run one of the following commands from your project root, replacing `path/to/your-key-file.json` with the actual path to your downloaded file.

**On Windows (PowerShell/CMD):**
```bash
type path/to/your-key-file.json | node scripts/format-firebase-key.js
```
Then paste your JSON and press Enter twice.

### Option 2: Manual formatting
1. Open the downloaded JSON file
2. Copy the entire JSON content
3. In browser console, run: `JSON.stringify(PASTE_YOUR_JSON_HERE)`
4. Copy the result (it will be a single-line string with escaped quotes)

## Add to environment:

1. Copy the formatted string
2. Add to `.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ```
3. Add the same to your Vercel environment variables

## Vercel Environment Setup:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add `FIREBASE_SERVICE_ACCOUNT_KEY` with the formatted JSON string
3. Set for Production, Preview, and Development environments
4. Redeploy your application