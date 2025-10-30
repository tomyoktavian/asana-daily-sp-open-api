import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  cookieStore.delete('asana_access_token');
  cookieStore.delete('asana_refresh_token');

  return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL!));
}
