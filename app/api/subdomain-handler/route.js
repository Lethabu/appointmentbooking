
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const host = url.hostname;
  
  // Extract subdomain from host
  const subdomain = host.split('.')[0];
  
  if (subdomain && subdomain !== 'www') {
    // Rewrite to the salon page
    return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
  }
  
  return NextResponse.next();
}
