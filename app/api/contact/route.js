// app/api/contact/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    // Here you could store the message in a database or send an email
    // For now, just log it (replace with your logic)
    console.log('Contact form submission:', { name, email, message });
    // Example: store in Supabase, send to email API, etc.
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
